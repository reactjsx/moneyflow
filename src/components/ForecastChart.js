import React, { Component } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Button, Grid } from 'semantic-ui-react';

class ForecastChart extends Component {
  state = {
    displayChart: false,
    plotOptions: {
      line: {
        marker: {
          enabled: false
        }
      }
    },
    title: {
      text: this.props.category || ''
    },
    series: [{ name: 'Spent', data: [] },
             { name: 'Budget', data: [] }]
  }
  
  componentDidMount() {
    const transactions = ForecastChart.computeSumUpTransactions(this.props.transactions);
    const budget = Array.from({length: 31}, (v, k) => this.props.budget);
    this.setState({
      series: [{ name: 'Spent', data: transactions, color: 'red' },
               { name: 'Budget', data: budget, dashStyle: 'dash' }],
    });
  }
  
  static getDerivedStateFromProps(props, state) {
    const transactions = ForecastChart.computeSumUpTransactions(props.transactions);
    const budget = Array.from({length: 31}, (v, k) => props.budget);
    return { series: [{ name: 'Spent', data: transactions, color: 'red' },
                      { name: 'Budget', data: budget, dashStyle: 'dash' }] };
  }
  
  static computeSumUpTransactions = propTransactions => {
    const transactions = [];
    let i;
    for (i = 0; i < propTransactions.length; i++) {
      transactions.push(propTransactions[i] + (transactions[i - 1] || 0));
    }
    return transactions;
  }
  
  render() {
    if (!this.state.displayChart) {
      return (
        <Grid textAlign='center' style={{ marginTop: 0 }} >
          <Grid.Row>
            <Button 
              onClick={() => this.setState({ displayChart: true })}
              basic icon='chart line'
              circular
              color='blue' />
          </Grid.Row>
        </Grid>
      );
    }
    return (
      <div
        style={{ marginTop: '10px' }}
        onClick={() => this.setState({ displayChart: false })}
      >
        <HighchartsReact
          highcharts={Highcharts}
          options={this.state}
        />
      </div>
    );
  }
}

export default ForecastChart;