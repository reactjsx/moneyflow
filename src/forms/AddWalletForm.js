import React, { Component } from 'react';
import { Button, Header, Icon, Modal, Form, Input, Dropdown, Message } from 'semantic-ui-react';
import isNumeric from 'validator/lib/isNumeric';
import PropTypes from 'prop-types';
import currencies from '../common/currencies';
import { convertNumber, convertToString } from '../utils/helper';

class AddWalletForm extends Component {
  state = { 
    modalOpen: false,
    wallet: {
      name: '',
      currency: '',
      initBalance: ''
    },
    errors: {}
  };

  handleOpenClick = () => this.setState({ modalOpen: true });

  handleCloseClick = () => this.setState({ modalOpen: false });
  
  validate = (wallet) => {
    const errors = {};
    if (!wallet.name) {
      errors.name = `Name can't be empty`;
    }
    if (!wallet.currency) {
      errors.currency = `Currency can't be empty`;
    }
    
    if (!isNumeric(wallet.initBalance)) {
      errors.initBalance = `Initial Balance must be a valid number`;
    }
    return errors;
  }
  
  handleAddWalletClick = () => {
    const errors = this.validate(this.state.wallet);
    this.setState({ errors });
    if (Object.keys(errors).length === 0) {
      this.props.onAddWalletClick(this.state.wallet);
      this.setState({
        modalOpen: false,
        wallet: {
          name: '',
          currency: '',
          initBalance: ''
        }
      });
    }
  }
  
  handleInputChange = (event, data) => this.setState({
    wallet: { ...this.state.wallet, [data.name]: data.name === 'initBalance' ? convertToString(data.value) : data.value }
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
        trigger={<Button icon='plus' fluid color='red' onClick={this.handleOpenClick} />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='suitcase' content='Add Wallet' />
        <Modal.Content>
          <Form error={errorMessages.length !== 0}>
            {errorMessages}
            <Form.Field>
              <Input
                value={this.state.wallet.name}
                onChange={this.handleInputChange}
                placeholder='Name'
                fluid
                name='name'
              />
            </Form.Field>
            <Form.Field>
              <Dropdown
                placeholder='Currency'
                value={this.state.wallet.currency}
                onChange={this.handleInputChange}
                selection
                fluid
                options={currencies}
                name='currency'
              />
            </Form.Field>
            <Form.Field>
              <Input
                value={this.state.wallet.initBalance === '' ? this.state.wallet.initBalance : convertNumber(this.state.wallet.initBalance)}
                onChange={this.handleInputChange}
                placeholder='Init Balance'
                fluid
                name='initBalance'
              />
            </Form.Field>
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleAddWalletClick} inverted>
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

AddWalletForm.propTypes = {
  onAddWalletClick: PropTypes.func.isRequired
}

export default AddWalletForm;