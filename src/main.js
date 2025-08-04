import './style.css'
import { dictionary } from './words'

const message = document.createElement('div')
message.className = 'game-msg'
const mainContainer = document.getElementById('app')
const btn = document.createElement('button')

function handleModal() {
  let overlay = document.querySelector('.dark-overlay')
  let closeBtn = document.querySelector('.close-btn')
  const modal = document.querySelector('.modal')

  let selectors = [overlay, closeBtn]

  selectors.forEach((selector) =>
    selector.addEventListener('click', function () {
      modal.classList.add('hidden')
      overlay.classList.add('hidden')
    })
  )
}

handleModal()

const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
  grid: Array(6)
    .fill()
    .map(() => Array(5).fill('')),
  currentRow: 0,
  currentCol: 0,
  gameOver: false,
}

function updateGrid() {
  for (let i = 0; i < state.grid.length; i++) {
    for (let j = 0; j < state.grid[i].length; j++) {
      const box = document.getElementById(`box${i}${j}`)
      box.textContent = state.grid[i][j]
    }
  }
}

function drawBox(container, row, col, letter = '') {
  const box = document.createElement('div')
  box.className = 'box'
  box.id = `box${row}${col}`
  box.textContent = letter

  container.appendChild(box)
  return box
}

function drawGrid(container) {
  const grid = document.createElement('div')
  grid.className = 'grid'

  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 5; j++) {
      drawBox(grid, i, j)
    }
  }
  container.appendChild(grid)
}

function statusMessage() {
  mainContainer.appendChild(message)
  setTimeout(() => {
    message.remove()
  }, 5000)
}

function registeKeyBoardEvents() {
  document.body.onkeydown = (e) => {
    if (state.gameOver) return
    const key = e.key

    if (key === 'Enter') {
      if (state.currentCol === 5) {
        const word = getCurrentWord()
        if (isWordValid(word)) {
          revealWord(word)
          state.currentRow++
          state.currentCol = 0
        } else {
          statusMessage()
          message.textContent = `${word.toUpperCase()} is not on a word list`
        }
      }
    }

    if (key === 'Backspace') {
      removeLetter()
    }

    if (isLetter(key)) {
      addLetter(key)
    }

    updateGrid()
  }
}

function getCurrentWord() {
  return state.grid[state.currentRow].reduce((prev, curr) => prev + curr)
}

function isWordValid(word) {
  return dictionary.includes(word)
}

function revealWord(guess) {
  const row = state.currentRow

  for (let i = 0; i < 5; i++) {
    const box = document.getElementById(`box${row}${i}`)
    const letter = box.textContent

    if (letter === state.secret[i]) {
      box.classList.add('right')
    } else if (state.secret.includes(letter)) {
      box.classList.add('wrong')
    } else {
      box.classList.add('empty')
    }
  }

  const isWinner = state.secret === guess
  const isGameOver = state.currentRow === 5

  if (isWinner) {
    statusMessage()
    message.textContent = 'Amazing!'
    state.gameOver = true
    resetGame()
  } else if (isGameOver) {
    statusMessage()
    state.gameOver = true
    message.textContent = `Correct word is ${state.secret.toUpperCase()}. Better luck next time!`
    resetGame()
  }
}

function isLetter(key) {
  return key.length === 1 && key.match(/[a-z]/i)
}

function addLetter(letter) {
  if (state.currentCol === 5) return
  state.grid[state.currentRow][state.currentCol] = letter
  state.currentCol++
}

function removeLetter() {
  if (state.currentCol === 0) return
  state.grid[state.currentRow][state.currentCol - 1] = ''
  state.currentCol--
}

function newGame() {
  state.secret = dictionary[Math.floor(Math.random() * dictionary.length)]
  state.grid = Array(6)
    .fill()
    .map(() => Array(5).fill(''))
  state.currentRow = 0
  state.currentCol = 0
  state.gameOver = false
  const grid = document.querySelector('.grid')
  if (grid) grid.remove()
  btn.remove()
  if (message) {
    message.remove()
  }
  startUp()
}

function resetGame() {
  mainContainer.appendChild(btn)
  btn.className = 'reload-btn'
  btn.innerHTML = `<span> <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3C14.1231 3.00003 16.1778 3.7506 17.8009 5.11905C19.4241 6.48749 20.5113 8.3857 20.8703 10.4782C21.2292 12.5707 20.8369 14.7227 19.7627 16.5539C18.6885 18.3851 17.0014 19.7776 14.9998 20.4853C12.9981 21.193 10.8108 21.1702 8.82427 20.4211C6.83776 19.672 5.18003 18.2448 4.14406 16.3916C3.1081 14.5385 2.7606 12.3788 3.16298 10.2942C3.56537 8.20964 4.69174 6.33442 6.343 5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M3 4.5H7V8.5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    </span>`
  btn.addEventListener('click', newGame)
}

function startUp() {
  const game = document.getElementById('game')
  drawGrid(game)
  registeKeyBoardEvents()
  console.log(state.secret)
}

startUp()
