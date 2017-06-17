var Rebase = require('re-base');
export const firebase = require('firebase');
var app = firebase.initializeApp({
      apiKey: "AIzaSyAVeyZ9mNdBBsIPEVfC-aSswGqLYY_Auyk",
      authDomain: "buzz-4e06b.firebaseapp.com",
      databaseURL: "https://buzz-4e06b.firebaseio.com",
      storageBucket: "buzz-4e06b.appspot.com",
      messagingSenderId: "80844348642"
});

export const base = Rebase.createClass(app.database());