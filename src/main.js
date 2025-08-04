import './style.css'
import { words } from './words'

let currentLetter = 0
let currentRow = 0
let entries = []
let gameEnd = false

const letters = document.querySelectorAll('.letter')
const rows = document.querySelectorAll('.row')
const keyboardLetters = document.querySelectorAll('.keyboard_letter')
const backspaceBtn = document.querySelector('#backspace')
const enterBtn = document.querySelector('#enter')
let pressedKeyboard, keyboardAttr

const wordOfDay = words[Math.floor(Math.random() * words.length)].toUpperCase()

const mainContainer = document.querySelector('#app')
const statusElement = document.createElement('div')
statusElement.classList.add('status-element')

console.log(wordOfDay)

document.addEventListener('keydown', keyPress)

// if (rows[currentRow] > currentRow) {
//   gameEnd = true
//   return
// }

function keyPress(e) {
  let pressed = e.key.toUpperCase()

  //Test and enter letters
  if (/^[a-z]$/i.test(pressed)) {
    letters[currentLetter].innerHTML = pressed
    entries.push(pressed)
    currentLetter++
  }

  if (e.key === 'Enter') {
    console.log(currentRow)
    const enteredWord = entries.join('').toUpperCase()
    let win = enteredWord.toUpperCase() === wordOfDay

    if (currentLetter !== 5) {
      rows[currentRow].classList.add('shake')
      setTimeout(() => {
        rows[currentRow].classList.add('shake')
      }, 500)
    }

    if (win) {
      statusElement.innerHTML = 'Amazing!'
      mainContainer.appendChild(statusElement)
      rows[currentRow].classList.add('success')
      setTimeout(() => {
        statusElement.remove()
      }, 5000)
      return
    } else {
      currentRow++
      currentLetter = 0
      entries = []
    }
  }

  //Delete letters
  if (currentLetter > 0) {
    if (e.key === 'Backspace') {
      currentLetter--
      letters[currentLetter].innerHTML = ''
      entries.pop()
    }
  }
}

for (let i = 0; i < keyboardLetters.length; i++) {
  keyboardLetters[i].addEventListener('click', function () {
    pressedKeyboard = keyboardLetters[i].innerHTML
    keyboardAttr = keyboardLetters[i].setAttribute('data-pressed', pressedKeyboard)
    console.log('hi', pressedKeyboard)

    if (keyboardLetters[i] === backspaceBtn) {
      console.log('backspace button clicked')
    }

    if (keyboardLetters[i] === enterBtn) {
      console.log('enter button clicked')
    }
  })
}
