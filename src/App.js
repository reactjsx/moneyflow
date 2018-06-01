import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';
import WalletList from './components/WalletList';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import Report from './components/Report';

const App = () => (
  <div className='ui container'>
    <Link to='/'>
      <Header size='huge' textAlign='center' style={{marginTop: '30px'}}>
        <Icon name='money' />Wo De Qian
      </Header>
    </Link>
    <Route path='/signin' component={ SignIn } />
    <Route path='/signup' component={ SignUp } />
    <Route path='/wallets' component={ WalletList } />
    <Route path='/reports' component={ Report } />
    <Route exact path='/' render={() => (
      <Redirect
        to='/wallets'
      />
    )}
    />
  </div>
);

export default App;
