'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Joao Gatto',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2022-11-18T21:31:17.178Z',
    '2022-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-05-27T17:01:17.194Z',
    '2023-10-09T23:36:17.929Z',
    '2023-10-10T10:51:36.790Z',
  ],
  currency: 'BRL',
  locale: 'pt-BR', // de-DE
};

const account2 = {
  owner: 'Maria Fernanda',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2022-11-01T13:15:33.035Z',
    '2022-11-30T09:48:16.867Z',
    '2022-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-10-09T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////// ELEMENTS ////////////////////////

const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelDateMovements = document.querySelector('.movements__date');

const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

////////////// FUNCTIONS //////////////////////

// ADICIONA/FORMATA DATA E HORA NOS MOVIMENTOS DA CONTA
const formatMoventDate = function (date, locale) {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    return Intl.DateTimeFormat(locale).format(date);
  }
};

// FORMATA A CURRENCY CONFORME LOCAL DO GLOBO
const formatCurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

// MOSTRA MOVIMENTOS DA CONTA
const displayMovements = function (acc, sort = false) {
  // Limpa o conteudo do container
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  // faz um loop sobre os movimentos da conta e apresenta eles na tela
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMoventDate(date, acc.locale);

    const formattedMov = formatCurrency(mov, acc.locale, acc.currency);

    // cria o HTML na pagina
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>`;
    // adicionar o HTML dentro do container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// CALCULA BALANCO
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = formatCurrency(
    acc.balance,
    acc.locale,
    acc.currency
  );
};

// CALCULAR RESUMO DA CONTA IN/OUT/INTEREST
const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatCurrency(income, acc.locale, acc.currency);

  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc - mov, 0);
  labelSumOut.textContent = formatCurrency(outcome, acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    // banco so paga interest acima de 1 caso contrario nao paga
    .filter((interest, i, arr) => {
      return interest >= 1;
    })
    .reduce((acc, interest) => acc + interest);
  labelSumInterest.textContent = formatCurrency(
    interest,
    acc.locale,
    acc.currency
  );
};

//CRIAR USERNAME
const createUserNames = function (accounts) {
  // usamos o foreach() para modificar cada um dos elementos dentro do array accounts
  accounts.forEach(function (account) {
    // criamos uma propriedade do objeto account que vai receber o username
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

// ATUALIZA A CONTA
const updateUI = function (acc) {
  // mostra movimentos conta
  displayMovements(acc);
  // mostra o balanco da conta
  calcDisplayBalance(acc);
  // mostra o resumo da conta
  calcDisplaySummary(acc);
};

// INICIA O TIMER PARA LOGOUT APÓS INICIAR A SESSÃO
const startLogOutTimer = function () {
  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    // a cada chamada printa o tempo restante para a UI
    labelTimer.textContent = `${min}:${sec}`;

    // quando zerar o tempo, para o timer e realiza o logout
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      containerApp.style.opacity = 0;
    }
    // retira 1 segundo
    time--;
  };

  // set timer para 5 min
  let time = 300;

  // invoca o timer a cada segundo
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};

////////////// EVENTS HANDLERS ////////////////

// LOGIN CHECK
let currentAccount, timer;

btnLogin.addEventListener('click', function (event) {
  // previnindo o form de realizar o submitting
  event.preventDefault();
  // Selecionando a conta que condiz com o login do usuario
  currentAccount = accounts.find(
    account => account.username === inputLoginUsername.value
  );
  // checando credenciais login e pin e atualizando a pagina
  // usando o optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // mostrar UI message
    labelWelcome.textContent = `Wellcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
  }
  // alterando a opacidade da tela ,deixando visivel
  containerApp.style.opacity = 100;

  //CRIA A DATA HORA DISPLAY
  const now = new Date();
  // objeto com propriedade para funcao Intl
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    // weekday: 'long',
  };

  // pega o local de acesso do nav para formatar date/time
  // const locale = navigator.language;

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  // limpando campo dados usuario
  inputLoginUsername.value = inputLoginPin.value = '';
  // tirando foco dos campos do usuario
  inputLoginPin.blur();

  if (timer) clearInterval(timer);

  timer = startLogOutTimer();

  updateUI(currentAccount);
});

/// TRANSFERIR DINHEIRO
btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  //limpa os campos de transferencia
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  // condicionais para transferencia ser valida
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // realiza a transferencia entre as contas
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // adiciona a data da transferencia
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    updateUI(currentAccount);

    // reseta o timer
    clearInterval(timer);
    timer = startLogOutTimer();
  }
});

// FECHAR CONTA / EXCLUIR USUARIO
btnClose.addEventListener('click', function (event) {
  event.preventDefault();

  //check as credenciais
  if (
    currentAccount.pin === Number(inputClosePin.value) &&
    currentAccount.username === inputCloseUsername.value
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // exclui conta
    accounts.splice(index, 1);

    // esconde UI
    containerApp.style.opacity = 0;
  }
  //limpa os campos de transferencia
  inputClosePin.value = inputCloseUsername.value = '';
  inputTransferAmount.blur();
});

// PEDIR EMPRESTIMO AO BANCO
btnLoan.addEventListener('click', function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(function () {
      // adiciona emprestimo na conta
      currentAccount.movements.push(amount);

      // add data do emprestimo
      currentAccount.movementsDates.push(new Date().toISOString());

      // atualiza a UI
      updateUI(currentAccount);

      // reseta o timer
      clearInterval(timer);
      timer = startLogOutTimer();
    }, 3000);
  }
  // limpa os dados do formulario de emprestimo
  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

// SORT BOTAO / ORGANIZAR MOVIMENTOS
let sorted = false;
btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
