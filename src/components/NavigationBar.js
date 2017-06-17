import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

/**
 * A simple example of `AppBar` with an icon on the right.
 * By default, the left icon is a navigation-menu.
 */

class NavigationBar extends Component {
  render() {
    return (
        <AppBar
          title="Buzz"
        />
    );
  }
}

export default NavigationBar;