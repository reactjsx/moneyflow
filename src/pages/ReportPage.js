import React, { Component } from 'react';
import { Route, Link, Redirect } from 'react-router-dom';
import { Button, Segment, Header, Progress, Grid, Divider } from 'semantic-ui-react';
import { getTransactions, isSignedIn, getCurrentDate } from '../utils/helper';
import currencies from '../common/currencies';
import months from '../common/months';
import AddBudgetForm from '../forms/AddBudgetForm';
import ForecastChart from '../components/ForecastChart';
import { createBudget, deleteBudget } from '../utils/helper';

class ReportPage extends Component {
  state = {
    redirectSignIn: false,
    displayCurrency: 'jp',
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
    }).then(() => this.setTransactions())
      .catch(e => console.error(e));
  }
  
  setTransactions = () => {
    getTransactions(data => {
      this.setState({ wallets: data.wallets, budgets: data.budgets });
    });
  }
  
  handleAddBudgetClick = (budget) => {
    createBudget(budget)
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
  
  handleTrashClick = (budgetId) => {
    deleteBudget({id: budgetId})
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
  
  setDisplayCurrency = (displayCurrency) => {
    this.setState({ displayCurrency });
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
          path='/reports/:wallet/:year/:month'
          render={({ match }) => {
            let oldYear = Number(match.params.year),
                newYear = Number(match.params.year),
                newMonth = Number(match.params.month) + 1,
                oldMonth = Number(match.params.month) - 1;
            if (oldMonth === 0) {
              oldMonth = 12;
              oldYear = oldYear - 1;
            } else if (newMonth === 13) {
              newMonth = 1;
              newYear = newYear + 1;
            }
            let totalSpent = 0;
            let totalIncome = 0;
            const categoricalSpent = {};
            const categoricalSpentDailySpent = {};
            const categoricalIncome = {};
            const budgets = {};
            this.state.budgets.filter(b => (
              b.year === Number(match.params.year)  && 
              b.month === Number(match.params.month) && 
              b.currency === this.state.displayCurrency
            )).forEach(budget => budgets[budget.category] = { id: budget._id, amount: budget.amount });
            
            this.state.wallets.forEach(wallet => {
              if (wallet.currency !== this.state.displayCurrency) return;
              
              const thisWalletTransactions = wallet.transactions.filter(t => (
                t.year === Number(match.params.year)  && t.month === Number(match.params.month)
              )).sort((a, b) => (b.day - a.day));
              thisWalletTransactions.forEach(t => {
                if (t.type === 'Outcome') {
                  if (t.category === 'Transfer To') return;
                  totalSpent += t.cost;
                  if (typeof categoricalSpent[t.category] === 'undefined') {
                    categoricalSpentDailySpent[t.category] = Array.from({length: 31}, (v, k) => 0);
                    categoricalSpentDailySpent[t.category][t.day - 1] += t.cost;
                    categoricalSpent[t.category] = [t.cost];
                  } else {
                    categoricalSpentDailySpent[t.category][t.day - 1] += t.cost;
                    categoricalSpent[t.category].push(t.cost);
                  }
                } else {
                  if (t.category === 'Transfer From') return;
                  totalIncome += t.cost;
                  if (typeof categoricalIncome[t.category] === 'undefined') {
                    categoricalIncome[t.category] = [t.cost];
                  } else {
                    categoricalIncome[t.category].push(t.cost);
                  }
                }
              });
            });
            const balance = totalIncome - totalSpent;
            const currencyCode = currencies.filter(c => c.value === this.state.displayCurrency)[0].code;
            const monthString = months.filter(m => m.value === Number(match.params.month))[0].code;
            const outcomeCategory = ['Convenient Store', 'Supermarket', 'Eating Out', 'Shopping', 'Transportation'];
            const displayOutcome = outcomeCategory.map(category => {
              let sumOfCategory = 0;
              if (categoricalSpent[category]) {
                sumOfCategory = categoricalSpent[category].reduce((a, b) => a + b, 0);
              }
              return (
              <div key={category}>
                <Divider />
                <Grid textAlign='center'>
                  <Grid.Row style={{ paddingBottom: 0 }}>
                    <Grid.Column>
                      <Header size='small'>
                        {category}
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: '5px' }}>
                    <Grid.Column>
                      <Header size='small'>
                        {currencyCode} {sumOfCategory}
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                  { !budgets[category] && (
                    <Grid.Row style={{ padding: 0 }}>
                      <AddBudgetForm
                        onAddBudgetClick={this.handleAddBudgetClick}
                        category={category}
                        currency={this.state.displayCurrency}
                        month={Number(match.params.month)}
                        year={Number(match.params.year)}
                      />
                    </Grid.Row>
                  )}
                  { budgets[category] && (
                    <Grid.Row style={{ paddingTop: 0 }}>
                      <Button circular onClick={() => this.handleTrashClick(budgets[category].id)} size='small' icon='trash' basic color='red' />
                      <Button circular size='small' icon='pencil' basic color='green' />
                    </Grid.Row>
                  )}
                </Grid>
                
                { sumOfCategory > 0 && budgets[category] && (
                  <ForecastChart
                    transactions={categoricalSpentDailySpent[category]}
                    category={category}
                    budget={budgets[category].amount}
                  />
                )}
                { budgets[category] && (
                  <Progress 
                    style={{ marginTop: '14px', marginBottom: '40px' }}
                    progress
                    color={Math.floor(sumOfCategory * 100 / budgets[category].amount) >= 100 ? 'red' : 'green'}
                    percent={Math.floor(sumOfCategory * 100 / budgets[category].amount)}
                    label={`${budgets[category].amount - sumOfCategory} / ${budgets[category].amount}`} />
                )}
                
                { !budgets[category] && <div style={{marginBottom: '30px'}} /> }
              </div>
              )}
            );
            return (
              <Segment raised>
                <Header size='huge' textAlign='center' color='blue'>
                  {`${monthString}, ${match.params.year}`}
                </Header>
                <Grid textAlign='center' >
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <Link
                        to={match.params.wallet !== 'noWallet' ?
                          `/reports/${match.params.wallet}/${oldYear}/${oldMonth}` :
                          `/reports/noWallet/${oldYear}/${oldMonth}`
                        }
                      >
                        <Button
                          basic
                          color='green'
                        >
                          Previous
                        </Button>
                      </Link>
                    </Grid.Column>
                    <Grid.Column>
                      <Link
                        to={match.params.wallet !== 'noWallet' ?
                          `/wallets/${match.params.wallet}/${match.params.year}/${match.params.month}` :
                          '/wallets'
                        }
                      >
                        <Button
                          circular
                          color='green'
                        >
                          Transactions
                        </Button>
                      </Link>
                    </Grid.Column>
                    <Grid.Column>
                      <Link
                        to={match.params.wallet !== '#' ?
                          `/reports/${match.params.wallet}/${newYear}/${newMonth}` :
                          `/reports/noWallet/${newYear}/${newMonth}`
                        }
                      >
                        <Button
                          basic
                          color='green'
                        >
                          Next
                        </Button>
                      </Link>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                    </Grid.Column>
                    <Grid.Column>
                      <Button basic circular icon
                        onClick={() => this.setDisplayCurrency('jp')}
                      >
                        <i style={{ margin: 0 }} className='jp flag' />
                      </Button>
                      <Button basic circular icon
                        onClick={() => this.setDisplayCurrency('tw')}
                      >
                        <i style={{ margin: 0 }} className='tw flag' />
                      </Button>
                      <Button basic circular icon
                        onClick={() => this.setDisplayCurrency('us')}
                      >
                        <i style={{ margin: 0 }} className='us flag' />
                      </Button>
                      <Button basic circular icon
                        onClick={() => this.setDisplayCurrency('vn')}
                      >
                        <i style={{ margin: 0 }} className='vn flag' />
                      </Button>
                    </Grid.Column>
                    <Grid.Column>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Header textAlign='right'>
                        Total Income
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign='left' color='blue'>
                        {currencyCode} {totalIncome}
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign='right'>
                        Total Spent
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign='left' color='red'>
                        {currencyCode} {totalSpent}
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Header textAlign='right'>
                        Balance
                      </Header>
                    </Grid.Column>
                    <Grid.Column>
                      <Header textAlign='left' color={balance < 0 ? 'red' : 'green'}>
                        {currencyCode} {balance}
                      </Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
                {displayOutcome}
              </Segment>
            );
          }}
        />
        <Route exact
          path='/reports'
          render={() => (
            <Redirect
              to={`/reports/noWallet/${currentDate.year}/${currentDate.month}`}
            />
          )}
        />
      </div>
    );
  }
}

export default ReportPage;