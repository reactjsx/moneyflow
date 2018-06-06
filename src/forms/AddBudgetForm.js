import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Form, Input, Dropdown, Message } from 'semantic-ui-react';
import isNumeric from 'validator/lib/isNumeric';
import PropTypes from 'prop-types';
import currencies from '../common/currencies';
import category from '../common/category';
import years from '../common/years';
import months from '../common/months';
import { convertNumber, convertToString } from '../utils/helper';

class AddBudgetForm extends Component {
  state = { 
    modalOpen: false,
    budget: {
      category: '',
      currency: '',
      year: '',
      month: '',
      amount: ''
    },
    errors: {}
  };

  handleOpenClick = () => this.setState({
    modalOpen: true,
    budget: {
      category: this.props.category || '',
      currency: this.props.currency || '',
      year: this.props.year || '',
      month: this.props.month || '',
      amount: ''
    }
  });

  handleCloseClick = () => this.setState({ modalOpen: false });
  
  validate = (budget) => {
    const errors = {};
    if (!budget.category) {
      errors.category = `Name can't be empty`;
    }
    if (!budget.currency) {
      errors.currency = `Currency can't be empty`;
    }
    
    if (!isNumeric(budget.amount)) {
      errors.amount = `Amount must be a valid number`;
    }
    return errors;
  }
  
  handleAddBudgetClick = () => {
    const errors = this.validate(this.state.budget);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.onAddBudgetClick(this.state.budget);
      this.setState({
        modalOpen: false,
        budget: {
          category: '',
          currency: '',
          year: '',
          month: '',
          amount: ''
        }
      });
    }
  }
  
  handleInputChange = (event, data) => this.setState({
    budget: { ...this.state.budget, [data.name]: data.name === 'amount' ? convertToString(data.value) : data.value }
  });

  render() {
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
      <Modal
        trigger={<Button icon='plus' circular color='green' onClick={this.handleOpenClick} />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='suitcase' content='Add Budget' />
        <Modal.Content>
          <Form error={errorMessages.length !== 0}>
            {errorMessages}
            <Form.Field>
              <Dropdown
                value={this.state.budget.category}
                onChange={this.handleInputChange}
                selection
                fluid
                options={category['Outcome']}
                name='category'
              />
            </Form.Field>
            <Form.Field>
              <Dropdown
                value={this.state.budget.currency}
                onChange={this.handleInputChange}
                selection
                fluid
                options={currencies}
                name='currency'
              />
            </Form.Field>
            <Form.Field>
              <Dropdown
                value={this.state.budget.year}
                onChange={this.handleInputChange}
                selection
                fluid
                options={years}
                name='year'
              />
            </Form.Field>
            <Form.Field>
              <Dropdown
                value={this.state.budget.month}
                onChange={this.handleInputChange}
                selection
                fluid
                options={months}
                name='month'
              />
            </Form.Field>
            <Form.Field>
              <Input
                value={this.state.budget.amount === '' ? this.state.budget.amount : convertNumber(this.state.budget.amount)}
                onChange={this.handleInputChange}
                placeholder='Amount'
                fluid
                name='amount'
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleAddBudgetClick} inverted>
            <Icon name='plus' /> Add
          </Button>
          <Button color='red' onClick={this.handleCloseClick} inverted>
            <Icon name='close' /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

AddBudgetForm.propTypes = {
  onAddBudgetClick: PropTypes.func.isRequired
};

export default AddBudgetForm;