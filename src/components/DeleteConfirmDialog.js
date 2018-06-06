import React, { Component } from 'react';
import { Modal, Icon, Header, Button, List } from 'semantic-ui-react';
import { convertNumber } from '../utils/helper';

class DeleteDialogConfirm extends Component {
  state = {
    modalOpen: false,
    transaction_id: this.props.id,
    name: this.props.name,
    type: this.props.type,
    category: this.props.category,
    cost: this.props.cost,
    year: this.props.year,
    month: this.props.month,
    day: this.props.day
  };

  handleConfirmClick = () => {
    this.props.onTrashClick(this.state.transaction_id);
    this.setState({ modalOpen: false });
  };

  handleOpenClick = () => this.setState({ modalOpen: true });

  handleCloseClick = () => this.setState({ modalOpen: false });

  render() {
    return (
      <Modal
        trigger={<Button icon='trash' basic color='red' onClick={this.handleOpenClick} />}
        open={this.state.modalOpen}
        onClose={this.handleClose}
        basic
        size='small'
      >
        <Header icon='trash' content='Delete Transaction' />
        <Modal.Content>
          Are you sure to delete the transaction below:
          <List bulleted>
            <List.Item>
              Name: {this.state.name}
            </List.Item>
            <List.Item>
              Type: {this.state.type}
            </List.Item>
            <List.Item>
              Category: {this.state.category}
            </List.Item>
            <List.Item>
              Cost: {convertNumber(this.state.cost)}
            </List.Item>
            <List.Item>
              Made on: {this.state.year}/{this.state.month}/{this.state.day}
            </List.Item>
          </List>
        </Modal.Content>
        <Modal.Actions>
          <Button color='green' onClick={this.handleConfirmClick} inverted>
            <Icon name='check' /> Confirm
          </Button>
          <Button color='red' onClick={this.handleCloseClick} inverted>
            <Icon name='close' /> Cancel
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default DeleteDialogConfirm;