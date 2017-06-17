import React, { Component } from 'react';
import {cyan500} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RaisedButton from 'material-ui/RaisedButton';
import logo from '../assets/logo.svg';
import '../styles/App.css';
import NavigationBar from './NavigationBar.js';
import HomeScreenContainer from '../containers/HomeScreenContainer.js';
import ResultsScreenContainer from '../containers/ResultsScreenContainer.js';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan500,
  },
  appBar: {
    height: 50,
  },
});

class App extends Component {
  render() {
    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <div className="App">
            <NavigationBar />
            <Route exact path='/' render={({history}) => 
              <HomeScreenContainer
                history={history}
              />
            }/>
            <Route path="/results/:id" component={ResultsScreenContainer}/>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default App;
