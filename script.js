const STORAGE_KEY = 'expenses'
const USERNAME_KEY = 'spendwise_user'

let expenses = []
let username = ''

const nameInput = document.getElementById('nameInput')
const amountInput = document.getElementById('amountInput')
const addBtn = document.getElementById('addBtn')
const expenseList = document.getElementById('expenseList')
const totalDisplay = document.getElementById('totalDisplay')
const countDisplay = document.getElementById('countDisplay')
const avgDisplay = document.getElementById('avgDisplay')
const highDisplay = document.getElementById('highDisplay')
const lowDisplay = document.getElementById('lowDisplay')
const greeting = document.getElementById('greeting')

function getUsername() {
  let name = localStorage.getItem(USERNAME_KEY)
  if (!name) {
    name = prompt('Welcome to SpendWise! What is your name?')
    if (name && name.trim()) {
      name = name.trim()
      localStorage.setItem(USERNAME_KEY, name)
    } else {
      name = 'User'
    }
  }
  return name
}

function showGreeting() {
  const hour = new Date().getHours()
  let time = 'Hello'
  if (hour < 12) time = 'Good morning'
  else if (hour < 17) time = 'Good afternoon'
  else time = 'Good evening'
  greeting.textContent = `${time}, ${username}!`
}

function loadExpenses() {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      expenses = JSON.parse(stored)
    } catch {
      expenses = []
    }
  }
}

function saveExpenses() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
}

function formatNaira(amount) {
  return '₦' + Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function render() {
  expenseList.innerHTML = ''

  if (expenses.length === 0) {
    expenseList.innerHTML = '<li class="empty-msg">No expenses added yet.</li>'
    totalDisplay.textContent = '₦0.00'
    countDisplay.textContent = '0'
    avgDisplay.textContent = '₦0.00'
    highDisplay.textContent = '₦0.00'
    lowDisplay.textContent = '₦0.00'
    return
  }

  let total = 0
  let amounts = []

  expenses.forEach((exp, index) => {
    const amt = Number(exp.amount)
    total += amt
    amounts.push(amt)

    const li = document.createElement('li')
    li.className = 'expense-item'

    li.innerHTML = `
      <div class="expense-info">
        <span class="expense-name">${escapeHtml(exp.name)}</span>
        <span class="expense-amount">${formatNaira(exp.amount)}</span>
      </div>
      <button class="delete-btn" data-index="${index}" title="Remove expense">&times;</button>
    `

    expenseList.appendChild(li)
  })

  totalDisplay.textContent = formatNaira(total)
  countDisplay.textContent = expenses.length
  avgDisplay.textContent = formatNaira(total / expenses.length)
  highDisplay.textContent = formatNaira(Math.max(...amounts))
  lowDisplay.textContent = formatNaira(Math.min(...amounts))
}

function escapeHtml(str) {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

function addExpense() {
  const name = nameInput.value.trim()
  const amount = amountInput.value.trim()

  if (!name) {
    alert('Please enter an expense name.')
    nameInput.focus()
    return
  }

  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    alert('Please enter a valid amount greater than 0.')
    amountInput.focus()
    return
  }

  expenses.push({ name, amount: Number(amount) })
  saveExpenses()
  render()

  nameInput.value = ''
  amountInput.value = ''
  nameInput.focus()
}

function removeExpense(index) {
  expenses.splice(index, 1)
  saveExpenses()
  render()
}

addBtn.addEventListener('click', addExpense)

nameInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    amountInput.focus()
  }
})

amountInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addExpense()
  }
})

expenseList.addEventListener('click', (e) => {
  const btn = e.target.closest('.delete-btn')
  if (btn) {
    const index = Number(btn.dataset.index)
    removeExpense(index)
  }
})

username = getUsername()
showGreeting()
loadExpenses()
render()
