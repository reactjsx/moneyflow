import React from 'react';
import { Route, Redirect, Link } from 'react-router-dom';
import { Header, Icon } from 'semantic-ui-react';
import WalletPage from './pages/WalletPage';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ReportPage from './pages/ReportPage';

const App = () => (
  <div className='ui container'>
    <Link to='/'>
      <Header size='huge' textAlign='center' style={{marginTop: '30px'}}>
        <Icon name='money' />MoneyFlow
      </Header>
    </Link>
    <Route path='/signin' component={ SignIn } />
    <Route path='/signup' component={ SignUp } />
    <Route path='/wallets' component={ WalletPage } />
    <Route path='/reports' component={ ReportPage } />
    <Route exact path='/' render={() => (
      <Redirect
        to='/wallets'
      />
    )}
    />
  </div>
);

export default App;
