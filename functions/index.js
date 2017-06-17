const functions = require('firebase-functions');
const mkdirp = require('mkdirp-promise');
const gcs = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision')();
const exec = require('child-process-promise').exec;
const LOCAL_TMP_FOLDER = '/tmp/';

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

/**
 * When an image is uploaded we check if it is flagged as Adult or Violence by the Cloud Vision
 * API and if it is we blur it using ImageMagick.
 */
exports.blurOffensiveImages = functions.storage.object().onChange(event => {
  const object = event.data;
  const file = gcs.bucket(object.bucket).file(object.name);

  // Exit if this is a move or deletion event.
  if (object.resourceState === 'not_exists') {
    return console.log('This is a deletion event.');
  }

  return vision.detect(file, ['document']).then(data => {
    console.log(file);
    console.log(object);
    console.log(object.name);
    console.log(data);
    console.log(data[1].responses);
    console.log(data[1].responses[0].fullTextAnnotation.pages[0])
    console.log(data[1].responses[0].fullTextAnnotation.pages[0].blocks[3].paragraphs[0]);
    console.log(data[1].responses[0].fullTextAnnotation.pages[0].blocks[1].paragraphs[0]);
    console.log(data[1].responses[0].fullTextAnnotation.pages[0].blocks[3].paragraphs[0].words[1].symbols);

    // get ID of place to add average to
    const placeId = object.name.split('/')[0];
    
    // parse new bill amount
    const firstPage = data[1].responses[0].fullTextAnnotation.pages[0];
    let preDecimalCost = '';
    firstPage.blocks[3].paragraphs[0].words[1].symbols.forEach((symbolObject) => {
        preDecimalCost = preDecimalCost + symbolObject.text;
    });
    let postDecimalCost = '';
    firstPage.blocks[3].paragraphs[0].words[3].symbols.forEach((symbolObject) => {
        postDecimalCost = postDecimalCost + symbolObject.text;
    });
    const bill = parseFloat(preDecimalCost + '.' + postDecimalCost);
    console.log(bill);

    let monthBilled = '';
    firstPage.blocks[1].paragraphs[0].words[9].symbols.forEach((symbolObject) => {
        monthBilled = monthBilled + symbolObject.text;
    });

    // Get month string for pulling averages
    const monthString = getMonthString(parseInt(monthBilled));

    // push bill to firebase
    const monthBillingRef = admin.database().ref(`places/${placeId}/billing/2017/${monthString}`).push(bill);

  });

  function getMonthString(monthInt) {
      switch (monthInt) {
          case 1:
            return 'January';
          case 2:
            return 'February';
          case 3:
            return 'March';
          case 4:
            return 'April';
          case 5:
            return 'May';
          case 6:
            return 'June';
          case 7:
            return 'July';
      }
  }

  // Check the image content using the Cloud Vision API.
//   return vision.detectSafeSearch(file).then(data => {
//     const safeSearch = data[0];
//     console.log('SafeSearch results on image', safeSearch);

//     if (safeSearch.adult || safeSearch.violence) {
//       return blurImage(object.name, object.bucket, object.metadata);
//     }
//   });
});

/**
 * Blurs the given image located in the given bucket using ImageMagick.
 */
function blurImage(filePath, bucketName, metadata) {
  const filePathSplit = filePath.split('/');
  filePathSplit.pop();
  const fileDir = filePathSplit.join('/');
  const tempLocalDir = `${LOCAL_TMP_FOLDER}${fileDir}`;
  const tempLocalFile = `${LOCAL_TMP_FOLDER}${filePath}`;
  const bucket = gcs.bucket(bucketName);

  // Create the temp directory where the storage file will be downloaded.
  return mkdirp(tempLocalDir).then(() => {
    console.log('Temporary directory has been created', tempLocalDir);
    // Download file from bucket.
    return bucket.file(filePath).download({
      destination: tempLocalFile
    });
  }).then(() => {
    console.log('The file has been downloaded to', tempLocalFile);
    // Blur the image using ImageMagick.
    return exec(`convert ${tempLocalFile} -channel RGBA -blur 0x8 ${tempLocalFile}`);
  }).then(() => {
    console.log('Blurred image created at', tempLocalFile);
    // Uploading the Blurred image.
    return bucket.upload(tempLocalFile, {
      destination: filePath,
      metadata: {metadata: metadata} // Keeping custom metadata.
    });
  }).then(() => {
    console.log('Blurred image uploaded to Storage at', filePath);
  });
}