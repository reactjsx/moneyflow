import React, { Component } from 'react';
import { Button, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import AddTransactionForm from '../forms/AddTransactionForm';

class AddTransactionPanel extends Component {
  state = {
    displayAddButton: true
  };
  
  handleAddButtonClick = () => this.setState({
    displayAddButton: false
  });
  
  handleCancelButtonClick = () => this.setState({
    displayAddButton: true
  });
  
  handleAddTransactionClick = (transaction) => {
    this.props.onAddTransactionClick(transaction);
    this.setState({ displayAddButton: true });
  }
  
  render() {
    if (this.state.displayAddButton) {
      return (
        <Grid textAlign='center'>
        <Grid.Row>
        <Button
          icon='plus'
          color='green'
          onClick={this.handleAddButtonClick}
        />
        </Grid.Row>
        </Grid>
      );
    }
    return (
      <AddTransactionForm
        walletId={this.props.walletId}
        walletNames={this.props.walletNames}
        walletName={this.props.walletName}
        currentDate={this.props.currentDate}
        onCancelClick={this.handleCancelButtonClick}
        onAddTransactionClick={this.handleAddTransactionClick}
      />
    );
  }
}

AddTransactionPanel.propTypes = {
  walletId: PropTypes.string.isRequired,
  walletName: PropTypes.string.isRequired,
  walletNames: PropTypes.array.isRequired,
  currentDate: PropTypes.object.isRequired,
  onAddTransactionClick: PropTypes.func.isRequired
}

export default AddTransactionPanel;