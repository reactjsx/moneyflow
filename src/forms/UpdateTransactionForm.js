import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Form, Input, Dropdown, Message } from 'semantic-ui-react';
import validator from 'validator';
import PropTypes from 'prop-types';
import years from '../common/years';
import months from '../common/months';
import days from '../common/days';
import category from '../common/category';
import types from '../common/types';
import { convertNumber } from '../utils/helper';

class UpdateTransactionForm extends Component {
  state = { 
    modalOpen: false,
    transaction: {
      id: this.props.id,
      name: this.props.name,
      type: this.props.type,
      category: this.props.category,
      cost: String(this.props.cost),
      year: this.props.year,
      month: this.props.month,
      day: this.props.day
    },
    errors: {}
  };

  handleOpenClick = () => this.setState({ modalOpen: true });

  handleCloseClick = () => this.setState({ modalOpen: false });
  
  validate = (transaction) => {
    const errors = {};
    if (!validator.isNumeric(transaction.cost)) {
      errors.cost = 'Cost must contain only number';
    }
    if (!transaction.name) {
      errors.name = `Name can't be empty`;
    }
    if (!transaction.type) {
      errors.type = `Type can't be empty`;
    }
    if (!transaction.category) {
      errors.category = `Category can't be empty`;
    }
    if (!transaction.year) {
      errors.year = `Year can't be empty`;
    }
    if (!transaction.month) {
      errors.month = `Month can't be empty`;
    }
    if (!transaction.day) {
      errors.day = `Day can't be empty`;
    }
    return errors;
  }
  
  handleUpdateTransactionClick = () => {
    const errors = this.validate(this.state.transaction);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.setState({ modalOpen: false })
      this.props.onUpdateTransactionClick(this.state.transaction);
    }
  }
  
  handleInputChange = (event, data) => this.setState({
    transaction: { ...this.state.transaction, [data.name]: data.value }
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
    const categoryOptions = this.state.transaction.type ? category[this.state.transaction.type] : null;
    return (
      <Modal
        trigger={<Button icon='pencil' color='green' basic onClick={this.handleOpenClick} />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='pencil' content='Update transaction' />
        <Modal.Content>
          <Form error={errorMessages.length !== 0}>
            {errorMessages}

            <Form.Field>
              <Input
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
                disabled={!categoryOptions}
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
                value={convertNumber(this.state.transaction.cost)}
                onChange={this.handleInputChange}
                fluid
                name='cost'
              />
            </Form.Field>

            <Form.Field>
              <Dropdown
                placeholder='Year'
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
            
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleUpdateTransactionClick} inverted>
            <Icon name='check' /> Update
          </Button>
          <Button color='red' onClick={this.handleCloseClick} inverted>
            <Icon name='close' /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

UpdateTransactionForm.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  cost: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
  month: PropTypes.number.isRequired,
  day: PropTypes.number.isRequired,
  onUpdateTransactionClick: PropTypes.func.isRequired
}

export default UpdateTransactionForm;