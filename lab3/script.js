class Game2048 {
    constructor() {
        this.board = [];
        this.score = 0;
        this.size = 4;
        this.gameOver = false;
        this.history = [];
        this.cells = [];

        this.boardElement = document.getElementById('gameBoard');
        this.scoreElement = document.getElementById('score');
        this.newGameBtn = document.getElementById('newGameBtn');
        this.undoBtn = document.getElementById('undoBtn');
        this.leaderboardBtn = document.getElementById('leaderboardBtn');
        this.leaderboardModal = document.getElementById('leaderboardModal');
        this.gameOverModal = document.getElementById('gameOverModal');
        this.closeModalBtn = document.getElementById('closeModalBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.saveScoreBtn = document.getElementById('saveScoreBtn');
        this.playerNameInput = document.getElementById('playerName');
        this.scoreSubmitContainer = document.getElementById('scoreSubmitContainer');
        this.scoreSavedMessage = document.getElementById('scoreSavedMessage');
        this.gameOverMessage = document.getElementById('gameOverMessage');
        this.leaderboardBody = document.getElementById('leaderboardBody');

        this.moveUpBtn = document.getElementById('moveUpBtn');
        this.moveDownBtn = document.getElementById('moveDownBtn');
        this.moveLeftBtn = document.getElementById('moveLeftBtn');
        this.moveRightBtn = document.getElementById('moveRightBtn');
        this.mobileControls = document.getElementById('mobileControls');

        this.leaderboard = this.loadLeaderboard();

        this.init();
    }

    init() {
        this.createBoardCells();

        this.newGame();

        this.addEventListeners();
    }

    createBoardCells() {
        while (this.boardElement.firstChild) {
            this.boardElement.removeChild(this.boardElement.firstChild);
        }

        this.cells = [];

        for (let i = 0; i < 16; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = `cell-${i}`;
            cell.setAttribute('data-row', Math.floor(i / 4));
            cell.setAttribute('data-col', i % 4);
            cell.setAttribute('data-value', '0');

            this.boardElement.appendChild(cell);
            this.cells.push(cell);
        }
    }

    newGame() {
        this.board = Array(this.size).fill().map(() => Array(this.size).fill(0));
        this.score = 0;
        this.gameOver = false;
        this.history = [];

        this.addRandomTile();
        this.addRandomTile();

        this.updateBoard();
        this.updateScore();
        this.updateUndoButton();

        this.gameOverModal.style.display = 'none';

        if (window.innerWidth <= 768) {
            this.mobileControls.style.display = 'grid';
        }
    }

    addRandomTile() {
        const emptyCells = [];

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }

        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            this.board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    updateBoard() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const index = row * this.size + col;
                const cell = this.cells[index];
                const value = this.board[row][col];

                cell.className = 'cell';

                if (value !== 0) {
                    cell.textContent = value;
                    cell.classList.add(`tile-${value}`);
                    cell.setAttribute('data-value', value);
                } else {
                    cell.textContent = '';
                    cell.setAttribute('data-value', '0');
                }
            }
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    updateUndoButton() {
        this.undoBtn.disabled = this.history.length === 0 || this.gameOver;
    }

    addEventListeners() {
        this.newGameBtn.addEventListener('click', () => this.newGame());
        this.undoBtn.addEventListener('click', () => this.undo());
        this.leaderboardBtn.addEventListener('click', () => this.showLeaderboard());

        this.closeModalBtn.addEventListener('click', () => this.closeModals());
        this.playAgainBtn.addEventListener('click', () => {
            this.closeModals();
            this.newGame();
        });

        this.saveScoreBtn.addEventListener('click', () => this.saveScore());

        document.addEventListener('keydown', (e) => this.handleKeyPress(e));

        this.moveUpBtn.addEventListener('click', () => this.move('up'));
        this.moveDownBtn.addEventListener('click', () => this.move('down'));
        this.moveLeftBtn.addEventListener('click', () => this.move('left'));
        this.moveRightBtn.addEventListener('click', () => this.move('right'));

        window.addEventListener('click', (e) => {
            if (e.target === this.leaderboardModal || e.target === this.gameOverModal) {
                this.closeModals();
            }
        });
    }

    handleKeyPress(e) {
        if (this.gameOver) return;

        const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
        if (arrows.includes(e.key)) {
            e.preventDefault();
        }

        switch(e.key) {
            case 'ArrowUp': this.move('up'); break;
            case 'ArrowDown': this.move('down'); break;
            case 'ArrowLeft': this.move('left'); break;
            case 'ArrowRight': this.move('right'); break;
        }
    }

    move(direction) {
        if (this.gameOver) return;

        this.saveState();

        const oldBoard = JSON.parse(JSON.stringify(this.board));

        let moved = false;
        let addedScore = 0;

        switch(direction) {
            case 'left':
                ({ moved, addedScore } = this.moveLeft());
                break;
            case 'right':
                ({ moved, addedScore } = this.moveRight());
                break;
            case 'up':
                ({ moved, addedScore } = this.moveUp());
                break;
            case 'down':
                ({ moved, addedScore } = this.moveDown());
                break;
        }

        if (moved) {
            this.score += addedScore;
            this.addRandomTile();
            this.updateBoard();
            this.updateScore();

            if (this.checkGameOver()) {
                this.gameOver = true;
                this.showGameOverModal();
            }
        } else {
            this.history.pop();
        }

        this.updateUndoButton();
    }

    moveLeft() {
        let moved = false;
        let addedScore = 0;

        for (let row = 0; row < this.size; row++) {
            const originalRow = [...this.board[row]];
            const result = this.processLine(originalRow);

            if (JSON.stringify(originalRow) !== JSON.stringify(result.line)) {
                moved = true;
                this.board[row] = result.line;
                addedScore += result.score;
            }
        }

        return { moved, addedScore };
    }

    moveRight() {
        let moved = false;
        let addedScore = 0;

        for (let row = 0; row < this.size; row++) {
            const originalRow = [...this.board[row]].reverse();
            const result = this.processLine(originalRow);
            const newRow = result.line.reverse();

            if (JSON.stringify(this.board[row]) !== JSON.stringify(newRow)) {
                moved = true;
                this.board[row] = newRow;
                addedScore += result.score;
            }
        }

        return { moved, addedScore };
    }

    moveUp() {
        let moved = false;
        let addedScore = 0;

        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = 0; row < this.size; row++) {
                column.push(this.board[row][col]);
            }

            const result = this.processLine(column);

            for (let row = 0; row < this.size; row++) {
                if (this.board[row][col] !== result.line[row]) {
                    moved = true;
                    this.board[row][col] = result.line[row];
                }
            }
            addedScore += result.score;
        }

        return { moved, addedScore };
    }

    moveDown() {
        let moved = false;
        let addedScore = 0;

        for (let col = 0; col < this.size; col++) {
            const column = [];
            for (let row = 0; row < this.size; row++) {
                column.push(this.board[row][col]);
            }

            const reversedColumn = column.reverse();
            const result = this.processLine(reversedColumn);
            const newColumn = result.line.reverse();

            for (let row = 0; row < this.size; row++) {
                if (this.board[row][col] !== newColumn[row]) {
                    moved = true;
                    this.board[row][col] = newColumn[row];
                }
            }
            addedScore += result.score;
        }

        return { moved, addedScore };
    }

    processLine(line) {
        const filtered = line.filter(val => val !== 0);
        const result = [];
        let score = 0;
        let i = 0;

        while (i < filtered.length) {
            if (i < filtered.length - 1 && filtered[i] === filtered[i + 1]) {
                const mergedValue = filtered[i] * 2;
                result.push(mergedValue);
                score += mergedValue;
                i += 2;
            } else {
                result.push(filtered[i]);
                i++;
            }
        }

        while (result.length < this.size) {
            result.push(0);
        }

        return { line: result, score };
    }

    checkGameOver() {
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === 0) {
                    return false;
                }
            }
        }

        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size - 1; col++) {
                if (this.board[row][col] === this.board[row][col + 1]) {
                    return false;
                }
            }
        }

        for (let row = 0; row < this.size - 1; row++) {
            for (let col = 0; col < this.size; col++) {
                if (this.board[row][col] === this.board[row + 1][col]) {
                    return false;
                }
            }
        }

        return true;
    }

    showGameOverModal() {
        this.gameOverMessage.textContent = 'Игра окончена!';
        this.scoreSubmitContainer.style.display = 'block';
        this.scoreSavedMessage.style.display = 'none';
        this.playerNameInput.value = '';
        this.gameOverModal.style.display = 'flex';
        this.mobileControls.style.display = 'none';
    }

    saveScore() {
        const playerName = this.playerNameInput.value.trim();

        if (playerName) {
            const date = new Date();
            const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

            this.leaderboard.push({
                name: playerName,
                score: this.score,
                date: formattedDate
            });

            this.leaderboard.sort((a, b) => b.score - a.score);
            if (this.leaderboard.length > 10) {
                this.leaderboard = this.leaderboard.slice(0, 10);
            }

            localStorage.setItem('leaderboard2048', JSON.stringify(this.leaderboard));

            this.scoreSubmitContainer.style.display = 'none';
            this.scoreSavedMessage.style.display = 'block';
            this.gameOverMessage.textContent = 'Рекорд сохранен!';
        }
    }

    saveState() {
        const state = {
            board: this.board.map(row => [...row]),
            score: this.score
        };
        this.history.push(state);
    }

    undo() {
        if (this.history.length === 0 || this.gameOver) return;

        const previousState = this.history.pop();
        this.board = previousState.board;
        this.score = previousState.score;

        this.updateBoard();
        this.updateScore();
        this.updateUndoButton();
    }

    showLeaderboard() {
        while (this.leaderboardBody.firstChild) {
            this.leaderboardBody.removeChild(this.leaderboardBody.firstChild);
        }

        const sortedLeaderboard = [...this.leaderboard].sort((a, b) => b.score - a.score);

        sortedLeaderboard.forEach(entry => {
            const row = document.createElement('tr');

            const nameCell = document.createElement('td');
            nameCell.textContent = entry.name;

            const scoreCell = document.createElement('td');
            scoreCell.textContent = entry.score;

            const dateCell = document.createElement('td');
            dateCell.textContent = entry.date;

            row.appendChild(nameCell);
            row.appendChild(scoreCell);
            row.appendChild(dateCell);

            this.leaderboardBody.appendChild(row);
        });

        this.leaderboardModal.style.display = 'flex';
        this.mobileControls.style.display = 'none';
    }

    closeModals() {
        this.leaderboardModal.style.display = 'none';
        this.gameOverModal.style.display = 'none';

        if (window.innerWidth <= 768 && !this.gameOver) {
            this.mobileControls.style.display = 'grid';
        }
    }

    loadLeaderboard() {
        const saved = localStorage.getItem('leaderboard2048');
        return saved ? JSON.parse(saved) : [];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game2048();
});