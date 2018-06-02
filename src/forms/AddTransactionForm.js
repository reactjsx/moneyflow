import React, { Component } from 'react';
import { Form, Button, Input, Dropdown, Message } from 'semantic-ui-react';
import validator from 'validator';
import PropTypes from 'prop-types';
import years from '../common/years';
import months from '../common/months';
import days from '../common/days';
import category from '../common/category';
import types from '../common/types';

class AddTransactionForm extends Component {
  state = {
    transaction: {
      walletId: this.props.walletId,
      wallet: this.props.walletName,
      name: '',
      type: null,
      category: null,
      cost: '',
      year: this.props.currentDate.year,
      month: this.props.currentDate.month,
      day: this.props.currentDate.day
    },
    errors: {}
  };
  
  handleInputChange = (event, data) => this.setState({
    transaction: { ...this.state.transaction, [data.name]: data.value }
  });
  
  validate = (data) => {
    const errors = {};
    if (!validator.isNumeric(data.cost)) {
      errors.cost = 'Cost must contain only number';
    }
    if (!data.name) {
      errors.name = `Name can't be empty`;
    }
    if (!data.type) {
      errors.type = `Type can't be empty`;
    }
    if (!data.category) {
      errors.category = `Category can't be empty`;
    }
    if (!data.year) {
      errors.year = `Year can't be empty`;
    }
    if (!data.month) {
      errors.month = `Month can't be empty`;
    }
    if (!data.day) {
      errors.day = `Day can't be empty`;
    }
    return errors;
  }
  
  handleAddTransactionClick = () => {
    const errors = this.validate(this.state.transaction);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.onAddTransactionClick(this.state.transaction);
    }
  }
  
  render() {
    const isCategoryDisabled = !this.state.transaction.type;
    const categoryOptions = this.state.transaction.type ? category[this.state.transaction.type] : null;
    const errors = this.state.errors;
    const keys = Object.keys(errors);
    const errorMessages = keys.map(key => (
      <Message
        key={key}
        error
        header={key}
        content={errors[key]}
      />
    ));
    return (
      <Form error={errorMessages.length !== 0}>
        {errorMessages}
        <Form.Group widths='equal'>
          <Form.Field>
            <Dropdown
              placeholder='Wallet'
              value={this.state.transaction.wallet}
              onChange={this.handleInputChange}
              selection
              fluid
              options={this.props.walletNames}
              name='wallet'
            />
          </Form.Field>
          
          <Form.Field>
            <Input
              placeholder='Name'
              value={this.state.transaction.name}
              onChange={this.handleInputChange}
              fluid
              name='name'
            />
          </Form.Field>
          
          <Form.Field>
            <Dropdown
              placeholder='Type'
              value={this.state.transaction.type}
              onChange={this.handleInputChange}
              selection
              fluid
              options={types}
              name='type'
            />
          </Form.Field>
          
          <Form.Field>
            <Dropdown
              disabled={isCategoryDisabled}
              placeholder='Category'
              value={this.state.transaction.category}
              onChange={this.handleInputChange}
              selection
              fluid
              options={categoryOptions}
              name='category'
            />
          </Form.Field>
          
          <Form.Field>
            <Input
              placeholder='Cost'
              value={this.state.transaction.cost}
              onChange={this.handleInputChange}
              fluid
              name='cost'
            />
          </Form.Field>
        </Form.Group>
        
        <Form.Group widths='equal'>
          <Form.Field>
            <Dropdown
              value={this.state.transaction.year}
              onChange={this.handleInputChange}
              selection
              fluid
              options={years}
              name='year'
            />
          </Form.Field>
          
          <Form.Field>
            <Dropdown
              placeholder='Month'
              value={this.state.transaction.month}
              onChange={this.handleInputChange}
              selection
              fluid
              options={months}
              name='month'
            />
          </Form.Field>
          
          <Form.Field>
            <Dropdown
              placeholder='Day'
              value={this.state.transaction.day}
              onChange={this.handleInputChange}
              selection
              fluid
              options={days}
              name='day'
            />
          </Form.Field>
        </Form.Group>
        
        <Form.Group  widths='equal'>
          <Form.Field>
            <Button
              onClick={this.handleAddTransactionClick}
              attached='bottom'
              basic
              color='green'
            >
              Add
            </Button>
          </Form.Field>
          
          <Form.Field>
            <Button
              attached='bottom'
              basic
              color='red'
              onClick={this.props.onCancelClick}
            >
              Cancel
            </Button>
          </Form.Field>
        </Form.Group>
      </Form>
    );
  }
}

AddTransactionForm.propTypes = {
  walletId: PropTypes.string.isRequired,
  walletName: PropTypes.string.isRequired,
  walletNames: PropTypes.array.isRequired,
  currentDate: PropTypes.object.isRequired,
  onAddTransactionClick: PropTypes.func.isRequired,
  onCancelClick: PropTypes.func.isRequired,
}

export default AddTransactionForm;