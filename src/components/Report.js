import React, { Component } from 'react';
import { Route, NavLink, Link, Redirect } from 'react-router-dom';
import { Button, Segment, Header, Progress, Divider, Grid } from 'semantic-ui-react';
import { getTransactions, isSignedIn, getCurrentDate } from '../utils/helper';
import currencies from '../common/currencies';
import months from '../common/months';

class WalletList extends Component {
  state = {
    redirectSignIn: false,
    wallets: [],
    budgets: []
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
    }).then(() => getTransactions(data => {
      this.setState({ wallets: data.wallets, budgets: data.budgets });
    }))
      .catch(e => console.error(e));
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
    
    return (
      <div>
        <Route
          path='/reports/:year/:month'
          render={({ match }) => {
            const totalOutcome = {};
            const totalIncome = {};
            const budgets = this.state.budgets.filter(b => (
              b.year === Number(match.params.year)  && b.month === Number(match.params.month)
            ));
            this.state.wallets.forEach(wallet => {
              if (wallet.currency !== 'jp') return;
              
              const thisWalletTransactions = wallet.transactions.filter(t => (
                t.year === Number(match.params.year)  && t.month === Number(match.params.month)
              )).sort((a, b) => (b.day - a.day));
              thisWalletTransactions.forEach(t => {
                if (t.type === 'Outcome') {
                  if (typeof totalOutcome[t.category] === 'undefined') {
                    totalOutcome[t.category] = [t.cost];
                  } else {
                    totalOutcome[t.category].push(t.cost);
                  }
                } else {
                  if (typeof totalIncome[t.category] === 'undefined') {
                    totalIncome[t.category] = [t.cost];
                  } else {
                    totalIncome[t.category].push(t.cost);
                  }
                }
              });
            });
            const currencyCode = currencies.filter(c => c.value === 'jp')[0].code;
            const monthString = months.filter(m => m.value === Number(match.params.month))[0].code;
            const outcomeCategory = Object.keys(totalOutcome);
            const displayOutcome = outcomeCategory.map(category => (
              <Grid.Row columns={1} key={category} >
                <Header size='small' textAlign='center' >
                  {category}: {currencyCode} {totalOutcome[category].reduce((a, b) => a + b, 0)}
                </Header>
                { budgets[category] && <Progress percent={50} color='green' label={totalOutcome[category].reduce((a, b) => a + b, 0)} /> }
              </Grid.Row>
            ));
            return (
              <Segment raised>
                <Header textAlign='center' color='red'>
                  {`Total Outcome of ${monthString}, ${currentDate.year}`}
                </Header>
                
                <Grid textAlign='center' >
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Link
                        to={`/reports/${match.params.year}/${Number(match.params.month) - 1}`}
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
                        to={`/wallets`}
                      >
                        <Button
                          circular
                          color='blue'
                        >
                          Transactions
                        </Button>
                      </Link>
                    </Grid.Column>
                    <Grid.Column>
                      <Link
                        to={`/reports/${match.params.year}/${Number(match.params.month) + 1}`}
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
                  {displayOutcome}
                </Grid>
              </Segment>
            );
          }}
        />
        <Route exact
          path='/reports'
          render={() => (
            <Redirect
              to={`/reports/${currentDate.year}/${currentDate.month}`}
            />
          )}
        />
      </div>
    );
  }
}

export default WalletList;