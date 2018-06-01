import React from 'react';
import { Button, Loader } from 'semantic-ui-react';
import AddWalletForm from '../components/AddWalletForm';

const WalletMenu = (props) => (
  <div>
    <div className='ui tabular top attached menu'>
      <div className='header item'>
        {props.nickname || ''}
      </div>
      {props.walletBar || ''}
      <div className='item'>
        <AddWalletForm
          onAddWalletClick={props.onAddWalletClick}
        />
      </div>
      <div className='item'>
        <Button
          circular
          color='red'
          onClick={props.onSignOutClick}
        >
          SignOut
        </Button>
      </div>
    </div>
    { !props.nickname && <Loader active />  }
  </div>
);

export default WalletMenu;