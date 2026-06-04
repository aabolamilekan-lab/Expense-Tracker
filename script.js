const STORAGE_KEY = 'expenses'

let expenses = []

const nameInput = document.getElementById('nameInput')
const amountInput = document.getElementById('amountInput')
const addBtn = document.getElementById('addBtn')
const expenseList = document.getElementById('expenseList')
const totalDisplay = document.getElementById('totalDisplay')
const countDisplay = document.getElementById('countDisplay')

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
    return
  }

  let total = 0

  expenses.forEach((exp, index) => {
    total += Number(exp.amount)

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

loadExpenses()
render()
