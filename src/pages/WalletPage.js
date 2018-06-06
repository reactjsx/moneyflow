import React, { Component } from 'react';
import { Route, NavLink, Link, Redirect } from 'react-router-dom';
import { Button, Segment, Header, Grid } from 'semantic-ui-react';
import { getTransactions, createTransaction, updateTransaction, createWallet, isSignedIn, getCurrentDate, deleteTransaction, convertNumber } from '../utils/helper';
import AddTransactionPanel from '../components/AddTransactionPanel';
import Wallet from '../components/Wallet';
import WalletMenu from '../components/WalletMenu';
import currencies from '../common/currencies';
import months from '../common/months';

class WalletPage extends Component {
  state = {
    redirectSignIn: false,
    wallets: [],
    nickname: ''
  }
  
  UNSAFE_componentWillMount() {
    if (!localStorage.getItem('wodeqian-token')) {
      this.setState({ redirectSignIn: true });
    }
  }
  
  componentDidMount() {
    isSignedIn().then(res => {
      if (res.error) {
        localStorage.removeItem('wodeqian-token');
        if (!this.state.redirectSignIn) {
          this.setState({ redirectSignIn: true });
        }
        throw new Error('Token is not valid');
      } else {
        this.setState({ nickname: res.nickname });
      }
    })
      .then(() => this.setTransactions())
      .catch(e => console.error(e));
  }
  
  setTransactions = () => {
    getTransactions(data => {
      this.setState({ wallets: data.wallets });
    });
  }
  
  handleAddWalletClick = (wallet) => {
    createWallet(wallet)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.setState({ redirectSignIn: true });
          throw new Error('Response Error');
        }
      })
      .then(() => this.setTransactions())
      .then(() => this.forceUpdate())
      .catch((e) => console.error(e));
  }

  handleAddTransactionClick = (transaction) => {
    createTransaction(transaction)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.setState({ redirectSignIn: true });
          throw new Error('Response Error');
        }
      })
      .then(() => this.setTransactions())
      .then(() => this.forceUpdate())
      .catch((e) => console.error(e));
  }

  handleUpdateTransactionClick = (transaction) => {
    updateTransaction(transaction)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.setState({ redirectSignIn: true });
          throw new Error('Response Error');
        }
      })
      .then(() => this.setTransactions())
      .then(() => this.forceUpdate())
      .catch((e) => console.error(e));
  }
  
  handleTrashClick = (transaction) => {
    deleteTransaction(transaction)
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.setState({ redirectSignIn: true });
          throw new Error('Response Error');
        }
      })
      .then(() => this.setTransactions())
      .then(() => this.forceUpdate());
  }
  
  handleSignOutClick = () => {
    localStorage.removeItem('wodeqian-token');
    if (!this.state.redirectSignIn) {
      this.setState({ redirectSignIn: true });
    }
    this.forceUpdate();
  }
  
  render() {
    if (this.state.redirectSignIn) {
      return (
        <Redirect
          to='/signin'
        />
      );
    }
    const currentDate = getCurrentDate();
    if (this.state.wallets.length > 0) {
      const walletBar = this.state.wallets.map(wallet => (
        <NavLink
          className='item'
          key={wallet._id}
          to={`/wallets/${wallet._id}`}
        >
          <i className={`${wallet.currency} flag`} />{wallet.name}
        </NavLink>
      ));
      return (
        <div>
          <WalletMenu
            walletBar={walletBar}
            onAddWalletClick={this.handleAddWalletClick}
            nickname={this.state.nickname}
            onSignOutClick={this.handleSignOutClick}
          />
          
          <Route
            path='/wallets/:walletId/:year/:month'
            render={({ match }) => {
              const wallet = this.state.wallets.find(w => (
                w._id === match.params.walletId
              ));
              const costs = wallet.transactions.map(transaction => {
                if (transaction.type === 'Income') {
                  return 0 - transaction.cost;
                }
                return transaction.cost;
              });
              const totalConsumption = costs.reduce((a, b) => a + b, 0);

              const currentMonthTransactions = wallet.transactions.filter(transaction => (
                transaction.month === Number(match.params.month) && transaction.year === Number(match.params.year)
              ));
              const thisMonthCosts = currentMonthTransactions.map(transaction => {
                if (transaction.type === 'Income' || transaction.category === 'Transfer To') {
                  return 0;
                }
                return transaction.cost;
              });
              const thisMonthConsumtion = thisMonthCosts.reduce((a, b) => a + b, 0);
              const walletNames = this.state.wallets.map(w => (
                {
                  text: w.name,
                  value: w.name
                }
              ));
              const currencyCode = currencies.filter(c => c.value === wallet.currency)[0].code;
              const monthString = months.filter(m => m.value === Number(match.params.month))[0].code;
              return (
              <Segment raised>
                <AddTransactionPanel
                  walletNames={walletNames}
                  walletId={wallet._id}
                  walletName={wallet.name}
                  onAddTransactionClick={this.handleAddTransactionClick}
                  currentDate={currentDate}
                />

                <Header size='huge' textAlign='center' color='blue'>
                  {`${monthString}, ${match.params.year}`}
                </Header>
                <Header textAlign='center' color='red' >
                  Consumption: {currencyCode} {convertNumber(thisMonthConsumtion)}
                </Header>
                <Header textAlign='center' color='green' >
                  Current Balance: {currencyCode} {convertNumber(wallet.initBalance - totalConsumption)}
                </Header>

                <Grid textAlign='center' columns={3}>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Link
                        to={ Number(match.params.month) > 1 ?
                          `/wallets/${wallet._id}/${match.params.year}/${Number(match.params.month) - 1}` :
                          `/wallets/${wallet._id}/${Number(match.params.year) - 1}/12`
                        }
                      >
                        <Button
                          basic
                          color='blue'
                        >
                          Previous
                        </Button>
                      </Link>
                    </Grid.Column>
                    <Grid.Column>
                      <Link
                        to={`/reports/${wallet._id}/${match.params.year}/${match.params.month}`}
                      >
                        <Button
                          circular
                          color='blue'
                        >
                          Report
                        </Button>
                      </Link>
                    </Grid.Column>
                    <Grid.Column>
                      <Link
                        to={ Number(match.params.month) < 12 ?
                          `/wallets/${wallet._id}/${match.params.year}/${Number(match.params.month) + 1}` :
                          `/wallets/${wallet._id}/${Number(match.params.year) + 1}/1`
                        }
                      >
                        <Button
                          basic
                          color='blue'
                        >
                          Next
                        </Button>
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>

                <Wallet
                  transactions={currentMonthTransactions}
                  currency={currencyCode}
                  walletName={wallet.name}
                  walletNames={walletNames}
                  walletId={wallet._id}
                  onTrashClick={this.handleTrashClick}
                  onUpdateTransactionClick={this.handleUpdateTransactionClick}
                />
              </Segment>
              );
            }}
          />
          <Route exact
            path='/wallets/:walletId/'
            render={({ match }) => (
              <Redirect
                to={`/wallets/${match.params.walletId}/${currentDate.year}/${currentDate.month}`}
              />
            )}
          />
        </div>
      );
    }
    return (
      <WalletMenu
        onAddWalletClick={this.handleAddWalletClick}
        onSignOutClick={this.handleSignOutClick}
      />
    );
  }
}

export default WalletPage;