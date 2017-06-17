import React, { Component } from 'react';
import HomeScreen from '../components/HomeScreen';
import { base } from '../config/firebase';

class HomeScreenContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: ''
    };
  }
  componentDidMount() {
    console.log(this.props.history);
  }

  onSearchForLocation(placesData) {
    this.lookupPlace(placesData.placeId).then((data) => {
        if (!data.length) {
            this.savePlace(placesData).then((data) => {
                this.navigateToResults(placesData.placeId);
            });
        }
        this.navigateToResults(placesData.placeId);
    })
  }

  lookupPlace(placeId) {
    return base.fetch(`places/${placeId}`, {
        context: this,
        asArray: true
    });
  }

  savePlace(placesData) {
    const {placeId, location, description} = placesData;
    const billing = {
      2017: {
        placeholder: true
      }
    };
    return base.post(`places/${placesData.placeId}`, {
        data: {placeId, location, description, billing}
    });
  }

  navigateToResults(placesId) {
    this.props.history.push(`/results/${placesId}`);
  }

  render() {
    return ( 
        <HomeScreen
            onSearchForLocation={this.onSearchForLocation.bind(this)} 
        /> 
    );
  }
}

export default HomeScreenContainer;
