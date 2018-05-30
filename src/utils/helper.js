export function getTransactions(next) {
  const token = localStorage.getItem('wodeqian-token');
  const url = `https://tranquil-bastion-52140.herokuapp.com/api/transactions?token=${token}`;
  return fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  })
    .then(response => response.json())
    .then(next);
}

export function deleteTransaction(data) {
  const token = localStorage.getItem('wodeqian-token');
  const url = `https://tranquil-bastion-52140.herokuapp.com/api/transactions?token=${token}`;
  return fetch(url, {
    method: 'delete',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

function removeToken() {
  localStorage.removeItem('wodeqian-token');
}

export function isSignedIn() {
  const token = localStorage.getItem('wodeqian-token');
  const url = `https://tranquil-bastion-52140.herokuapp.com/api/isUserSignedIn?token=${token}`;
  return fetch(url, {
    headers: {
      'Accept': 'application/json'
    }
  }).then(res => res.json())
    .catch(e => console.error(e))
}

export function signIn(data, next) {
  const url = 'https://tranquil-bastion-52140.herokuapp.com/api/users/signin';
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(next);
}

export function signUp(data, next) {
  const url = 'https://tranquil-bastion-52140.herokuapp.com/api/users/signup';
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(next);
}

export function signOut() {
  removeToken();
}

export function createTransaction(data) {
  const token = localStorage.getItem('wodeqian-token');
  const url = `https://tranquil-bastion-52140.herokuapp.com/api/transactions?token=${token}`;
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export function updateTransaction(data) {
  const token = localStorage.getItem('wodeqian-token');
  const url = `https://tranquil-bastion-52140.herokuapp.com/api/transactions?token=${token}`;
  return fetch(url, {
    method: 'put',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export function createWallet(data) {
  const token = localStorage.getItem('wodeqian-token');
  const url = `https://tranquil-bastion-52140.herokuapp.com/api/wallets?token=${token}`;
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export function createBudget(data) {
  const token = localStorage.getItem('wodeqian-token');
  const url = `https://tranquil-bastion-52140.herokuapp.com/api/budgets?token=${token}`;
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
}

export function getCurrentDate() {
  const today = new Date();
  return {
    day: today.getUTCDate(),
    month: today.getUTCMonth() + 1,
    year: today.getUTCFullYear()
  };
}