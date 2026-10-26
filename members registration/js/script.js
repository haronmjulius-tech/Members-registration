const form = document.getElementById('member-form')
const nameInput = document.getElementById('name')
const emailInput = document.getElementById('email')
const roleSelect = document.getElementById('role')
const bioTextarea = document.getElementById('bio')
const fields = [nameInput, emailInput, roleSelect, bioTextarea]
const getError = (field) => field.parentElement.querySelector('.error')

const successBox = document.getElementById('success-message')
const memberList = document.getElementById('member-list')
const memberCount = document.getElementById('member-count')
const darkModeBtn = document.getElementById('dark-mode-btn')

console.log({
  form,
  nameInput,
  emailInput,
  roleSelect,
  bioTextarea,
  errors: fields.map(getError),
  successBox,
  memberList,
  memberCount,
  darkModeBtn,
})

function showError(field, message) {
  getError(field).textContent = message
  field.classList.add('invalid')
}
function clearError(field) {
  getError(field).textContent = ''
  field.classList.remove('invalid')
}

function validate() {
  let valid = true

  const name = nameInput.value.trim()
  if (name === '') {
    showError(nameInput, 'Name is required.')
    valid = false
  } else if (name.length < 2) {
    showError(nameInput, 'Name must be at least 2 characters.')
    valid = false
  }

  const email = emailInput.value.trim()
  if (email === '') {
    showError(emailInput, 'Email is required.')
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(emailInput, 'Enter a valid email address.')
    valid = false
  }

  if (roleSelect.value === '') {
    showError(roleSelect, 'Please choose a role.')
    valid = false
  }

  const bio = bioTextarea.value.trim()
  if (bio === '') {
    showError(bioTextarea, 'Bio is required.')
    valid = false
  } else if (bio.length < 10) {
    showError(bioTextarea, 'Bio must be at least 10 characters.')
    valid = false
  }

  return valid
}

fields.forEach((field) => {
  const eventName = field.tagName === 'SELECT' ? 'change' : 'input'
  field.addEventListener(eventName, () => clearError(field))
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  successBox.hidden = true
  if (!validate()) return

  const name = nameInput.value.trim()
  addMember({
    name,
    email: emailInput.value.trim(),
    role: roleSelect.value,
    bio: bioTextarea.value.trim(),
  })
  updateCounter()
  showSuccess(`${name} was registered!`)
  form.reset()
  fields.forEach(clearError)
  nameInput.focus()
})

function addMember({ name, email, role, bio }) {
  const li = document.createElement('li')
  li.className = 'member'

  const info = document.createElement('div')
  const title = document.createElement('strong')
  title.textContent = name
  const details = document.createElement('span')
  details.textContent = ` · ${role} · ${email}`
  const bioP = document.createElement('p')
  bioP.textContent = bio
  info.append(title, details, bioP)

  const removeBtn = document.createElement('button')
  removeBtn.type = 'button'
  removeBtn.className = 'remove-btn'
  removeBtn.textContent = 'Remove'
  removeBtn.addEventListener('click', () => {
    li.remove()
    updateCounter()
  })

  li.append(info, removeBtn)
  memberList.appendChild(li)
}

function updateCounter() {
  memberCount.textContent = memberList.children.length
}

let successTimer
function showSuccess(message) {
  successBox.textContent = message
  successBox.hidden = false
  clearTimeout(successTimer)
  successTimer = setTimeout(() => (successBox.hidden = true), 4000)
}

function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark)
  darkModeBtn.textContent = isDark ? 'Light Mode' : 'Dark Mode'
}
darkModeBtn.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark')
  applyTheme(isDark)
  try {
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  } catch (e) {}
})
try {
  applyTheme(localStorage.getItem('theme') === 'dark')
} catch (e) {}

updateCounter()