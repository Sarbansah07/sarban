// Get grid and buttons
const grid = document.getElementById('sudoku-grid');
const solveBtn = document.getElementById('solve-btn');
const clearBtn = document.getElementById('clear-btn');
const timerDisplay = document.getElementById('timer');

// Timer setup
let startTime, timerInterval;

// Create the Sudoku grid (9x9 input fields)
for (let i = 0; i < 81; i++) {
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('maxlength', '1');
    input.setAttribute('data-index', i);
    input.addEventListener('input', handleInput);
    grid.appendChild(input);
}

// Handle input to ensure only numbers between 1 and 9 are entered
function handleInput(event) {
    const input = event.target;
    const value = input.value;

    if (value < 1 || value > 9 || isNaN(value)) {
        input.value = '';
        input.classList.add('invalid');
    } else {
        input.classList.remove('invalid');
    }
}

// Get board values from the grid
function getBoard() {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    const board = Array(9).fill().map(() => Array(9).fill(0));

    inputs.forEach((input, index) => {
        const value = input.value ? parseInt(input.value) : 0;
        const row = Math.floor(index / 9);
        const col = index % 9;
        board[row][col] = value;
    });

    return board;
}

// Set board values back to the grid
function setBoard(board) {
    const inputs = document.querySelectorAll('#sudoku-grid input');
    inputs.forEach((input, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        input.value = board[row][col] ? board[row][col] : '';
        input.classList.remove('invalid');
        input.classList.add('solved');
    });
}

// Check if it's safe to place a number
function isSafe(board, row, col, num) {
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num || board[x][col] === num) return false;
    }

    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i + startRow][j + startCol] === num) return false;
        }
    }

    return true;
}

// Backtracking algorithm to solve the Sudoku
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;

                        if (solveSudoku(board)) return true;

                        board[row][col] = 0; // Backtrack
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Start the timer
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        timerDisplay.innerText = `Time: ${elapsedTime.toFixed(2)}s`;
    }, 100);
}

// Stop the timer
function stopTimer() {
    clearInterval(timerInterval);
}

// Event listeners for solving and clearing the grid
solveBtn.addEventListener('click', () => {
    startTimer();
    const board = getBoard();
    if (solveSudoku(board)) {
        setBoard(board);
        stopTimer();
    } else {
        alert('No solution exists!');
        stopTimer();
    }
});

clearBtn.addEventListener('click', () => {
    document.querySelectorAll('#sudoku-grid input').forEach(input => {
        input.value = '';
        input.classList.remove('invalid', 'solved');
    });
    timerDisplay.innerText = 'Time: 0.00s';
    stopTimer();
});
