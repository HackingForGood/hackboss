import React, { Component } from 'react';
import {LineChart, YAxis, XAxis, CartesianAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer} from 'recharts';
import '../styles/ResultsScreen.css';
import {RaisedButton} from 'material-ui';

const defaultProps = {
    billing: [],
    placeId: '',
    description: ''
};

class ResultsScreen extends Component {
  constructor(props) {
    super(props);
    this.Graph = this.Graph.bind(this);
    this.Dashboard = this.Dashboard.bind(this);
    this.NoResults = this.NoResults.bind(this);
  }

  Graph = () => (
    <ResponsiveContainer>
        <LineChart data={this.props.billing}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line type="linear" dataKey="avg_bill" stroke="#82ca9d" />
        </LineChart>
    </ResponsiveContainer>
  );

  Dashboard = () => (
    <div>
        <div className='ResultScreen-Title'>
            {this.props.description}
        </div>
        <div className='ResultsScreen-Graph-Toolbar'>
            <RaisedButton 
                label='Upload Billing Data'
                containerElement='label'
                primary={true}
            >
                <input 
                    style={{display: 'none'}} 
                    type="file"
                    onChange={(event) => {this.props.uploadBillingData(event)}}
                />
            </RaisedButton>
        </div>

        <div className='ResultsScreen-Graph-Container'>
            <this.Graph />
        </div>
    </div>
  );

  NoResults = () => (
    <div>
        <div>
            No billing data for this area!
        </div>
        <div>
            <RaisedButton 
                label='Upload Billing Data'
                primary={true}
            />
        </div>
    </div>
  )

  render() {
    return (
      <div className='ResultsScreen-Container'>
        { this.props.billing.length ? <this.Dashboard /> : <this.NoResults/> }
      </div>
    );
  }
}

ResultsScreen.defaultProps = defaultProps;
export default ResultsScreen;
