import React, { Component } from 'react';
import ResultsScreen from '../components/ResultsScreen';
import { base } from '../config/firebase';
import { firebase } from '../config/firebase';

class ResultScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      placeData: {},
      screenReady: false
    };
  }

  componentDidMount() {
    const placeId = this.props.match.params.id;
    base.listenTo(`places/${placeId}`, {
        context: this,
        asArray: false,
        then(placeData) {
          const { description, placeId, billing } = placeData;
          const formattedBillingData = this.formatBillingData(billing);
          this.setState({description, placeId, billing: formattedBillingData});
          this.setState({screenReady: true});
        }
    });
  }

  formatBillingData(billingData) {
    const currentYearData = billingData['2017'];
    let finalFormat = [
      {name: 'January', avg_bill: 0},
      {name: 'February', avg_bill: 0},
      {name: 'March', avg_bill: 0},
      {name: 'April', avg_bill: 0},
      {name: 'May', avg_bill: 0},
      {name: 'June', avg_bill: 0}
    ];
    Object.keys(currentYearData).forEach((month) => {
      const bills = currentYearData[month];
      const sum = Object.keys(bills).reduce((memo, billKey) => {
        return parseFloat(bills[billKey]) + parseFloat(memo);
      }, 0); 
      const average = sum / Object.keys(bills).length;
      finalFormat.forEach((monthAvg) => {
        if (monthAvg.name === month) {
          monthAvg.avg_bill = average;
        }
      });
    });

    return finalFormat;
  }

  loadPlaceData(placeId) {
    return base.fetch(`places/${placeId}`, {
        context: this,
        asArray: false
    });
  }

  uploadBillingData(event) {
    this.uploadBlobToFirebaseStorage(event.target.files[0]);
  }

  uploadBlobToFirebaseStorage(imageBlob) {
    const storageRef = firebase.storage().ref();
    const currentPlacesId = this.props.match.params.id;
    const targetUploadPath = `${currentPlacesId}/${this.guid()}`;
    const targetUploadPathRef = storageRef.child(targetUploadPath);
    return targetUploadPathRef.put(imageBlob, { contentType: 'application/octet-stream' });
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
}

  render() {
    return ( 
        <ResultsScreen
          screenReady={false}
          description={this.state.description}
          placeId={this.state.placeId}
          billing={this.state.billing}
          uploadBillingData={this.uploadBillingData.bind(this)}
        /> 
    );
  }
}

export default ResultScreenContainer;
