import React, { Component } from 'react';
import { RaisedButton, TextField } from 'material-ui';
import '../styles/HomeScreen.css';
import {Tabs, Tab} from 'material-ui/Tabs';
import MapsPersonPin from 'material-ui/svg-icons/maps/person-pin';
import Geosuggest from 'react-geosuggest';
import { Link } from 'react-router-dom'

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSuggest: '',
      loading: false
    }
    this.SearchComponent = this.SearchComponent.bind(this);
  }

  componentDidMount() {
    console.log(this.props);
  }

  handleTapSearch() {
    console.log('test');
    this.props.onSearchForLocation(this.state.currentSuggest);
  }

  handleSuggestSelect(currentSuggest) {
    console.log(currentSuggest);
    this.setState({currentSuggest});
  }

  TabsExampleIconText = () => (
    <Tabs className='Home-Search-Tabs'>
      <Tab
        icon={<MapsPersonPin />}
        label="STREET ADDRESS"
      />
      <Tab
        icon={<MapsPersonPin />}
        label="APARTMENT COMMUNITIES"
      />
    </Tabs>
  );

  SearchComponent = () => (
    <div>
      <this.TabsExampleIconText  />
      <div className='Home-Search-Field'>
        <Geosuggest 
          className='Home-Search-Geo'
          inputClassName='Home-Search-Geo-Input'
          suggestItemClassName='Home-Search-Geo-Suggest-Item'
          onSuggestSelect={this.handleSuggestSelect.bind(this)}
        />
        <RaisedButton
          label='search'
          primary={true}
          onTouchTap={this.handleTapSearch.bind(this)}
        />
      </div>
    </div>
  )

  render() {
    return (
      <div className='Home-Search-Container'>
        <div className='Home-Search-Callout'>
          Search Electricity Costs
        </div>
        <this.SearchComponent />
      </div>
    );
  }
}

export default HomeScreen;
