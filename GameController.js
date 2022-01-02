import ComputerPlayer from './ComputerPlayer.js';
import HumanPlayer from './HumanPlayer.js';

const DRAW = 'EMPATE';
const WIN = 'VITORIA';

export default class GameController {
    constructor() {

        this.options = {
            boardSize: 3, // 3x3
            rounds: 3,
        };
        
        this.currentRound = -1;

        // this.board = new Board(this.options.boardSize);
        this.cells = [];
        
        this.players = [];
        this.currentPlayer = 0;
        this.winner = null;
        this.status = null;
        
        this.startScreenEl = document.getElementById('start-screen');
        this.roundScreenEl = document.getElementById('round-screen');
        
        
        this.boardScreenEl = document.getElementById('board-screen');
        this.scoreEl = this.boardScreenEl.querySelector('#score');
        this.hintEl = this.boardScreenEl.querySelector('#hint');
        this.boardContainerEl = this.boardScreenEl.querySelector('#board-container');
        this.boardEl = this.boardScreenEl.querySelector('#board');
        this.cellsEl = this.boardEl.querySelectorAll('.board__cell');

        window.addEventListener('resize', this.handleResize.bind(this));

        this.roundScreenEl.addEventListener("animationend", this.showBoardScreen.bind(this));
    }

    run() {
        this.startScreenEl.classList.add('screen--show');
        this.startScreenEl.querySelector('form').addEventListener('submit', this.configurePlayers.bind(this));
    }

    configurePlayers(e) {
        e.preventDefault();
        const player1 = {
            name: this.startScreenEl.querySelector('#player1-name').value || 'player 1',
            type: this.startScreenEl.querySelector('input[name="player1-type"]:checked')?.value || 'computer',
        };

        const player2 = {
            name: this.startScreenEl.querySelector('#player2-name').value || 'player 2',
            type: this.startScreenEl.querySelector('input[name="player2-type"]:checked')?.value || 'computer',
        };

        this.players = [];            
        this.players.push((player1.type == 'human') ? new HumanPlayer(player1.name, 'x') : new ComputerPlayer(player1.name, 'x'));
        this.players.push((player2.type == 'human') ? new HumanPlayer(player2.name, 'o') : new ComputerPlayer(player2.name, 'o'));
        
        this.startNewRound();
    }

    startNewRound() {
        this.currentRound++;
        this.showRoundScreen();
    }

    showRoundScreen() {
        this.roundScreenEl.querySelector('h1').innerText = `Round ${this.currentRound + 1}/${this.options.rounds}`;
        this.roundScreenEl.classList.add('screen--show');
        this.roundScreenEl.classList.add('animating');
    }

    showBoardScreen() {
        console.log('show board scree')
        this.startScreenEl.classList.remove('screen--show');
        this.boardScreenEl.classList.add('screen--show');
        this.handleResize();
        this.startRound();
        this.roundScreenEl.classList.remove('screen--show');
        this.roundScreenEl.classList.remove('animating');
    }

    handleResize(e) {
        console.log(e)
        console.log(this.boardContainerEl.offsetWidth, this.boardContainerEl.offsetHeight)
        const side = this.boardContainerEl.offsetWidth <= this.boardContainerEl.offsetHeight ? this.boardContainerEl.offsetWidth : this.boardContainerEl.offsetHeight;

        this.boardEl.style.width = side + 'px';
        this.boardEl.style.height = side + 'px';
    }

    resetBoard() {
        this.cells = [];

        for(let i = 0; i < this.options.boardSize; i++) {
            this.cells[i] = [];
            for(let j = 0; j < this.options.boardSize; j++) {
                this.cells[i][j] = '';
            }
        }

        this.boardEl.innerHTML = '';
        for(let i = 0; i < this.options.boardSize; i++) {
            for(let j = 0; j < this.options.boardSize; j++) {
                this.cells[i][j] = '';
                const newCell = document.createElement('div');
                newCell.classList.add('board__cell');
                newCell.dataset.i = i;
                newCell.dataset.j = j;
                newCell.addEventListener('click', this.handleClick.bind(this));
                this.boardEl.appendChild(newCell);
            }
        }

        this.cellsEl = this.boardEl.querySelectorAll('.board__cell');

    }

    handleClick(e) {
        // console.log(this.players[this.currentPlayer].name, 'clicou', e.target.dataset);

        //se o jogo já acabou...
        if(this.status != null) {
            return;
        }

        // this.hintEl.innerHTML = `${this.players[this.currentPlayer].name}: your turn!`;
        
        const c = e.target.dataset;
        // console.log(c)
        if(c){
            //TODO create method for Board
            this.cells[c.i][c.j] = this.players[this.currentPlayer].symbol;
        }

        this.drawBoard();
        
        this.status = this.checkWinner();
        this.winner = this.players[this.currentPlayer];

        //fim de jogo
        if(this.status != null) {
            // TODO mostrar tela de fim de jogo
            console.log(this.status, this.winner);
        } else {
            this.switchPlayer();
        }

    }

    
    checkWinner() {
        //horizontal
        if(
            (this.isEqual(this.cells[0][0], this.cells[0][1], this.cells[0][2]) && this.cells[0][0] != '') ||
            (this.isEqual(this.cells[1][0], this.cells[1][1], this.cells[1][2]) && this.cells[1][0] != '' ) ||
            (this.isEqual(this.cells[2][0], this.cells[2][1], this.cells[2][2]) && this.cells[2][0] != '' )
        ) {
            return WIN;
        }

        //vertical
        if(
            (this.isEqual(this.cells[0][0], this.cells[1][0], this.cells[2][0]) && this.cells[0][0] != '' ) ||
            (this.isEqual(this.cells[0][1], this.cells[1][1], this.cells[2][1]) && this.cells[0][1] != '') ||
            (this.isEqual(this.cells[0][2], this.cells[1][2], this.cells[2][2]) && this.cells[0][2] != '')
        ) {
            return WIN;
        }

        //diagonal
        if(
            (this.isEqual(this.cells[0][0], this.cells[1][1], this.cells[2][2]) && this.cells[0][0] != '' ) ||
            (this.isEqual(this.cells[2][0], this.cells[1][1], this.cells[0][2])  && this.cells[2][0] != '')
        ) {
            return WIN;
        }

        // checa empate
        if(!this.hasEmptyCells()) {
            return DRAW;
        }

        return null;
    }

    isEqual(a, b, c) {
        return (a == b && b == c);
    }

    hasEmptyCells() {
        for(let i = 0; i < this.options.boardSize; i++) {
            for(let j = 0; j < this.options.boardSize; j++) {
                if(this.cells[i][j] == '') {
                    return true;
                }
            }
        }

        return false;
    }

    drawBoard() {
        for(let i = 0; i < this.options.boardSize; i++) {
            for(let j = 0; j < this.options.boardSize; j++) {
                if(this.cells[i][j] == '') {
                    this.cellsEl[i*3 + j].classList.add('board__cell--empty');
                } else {
                    this.cellsEl[i*3 + j].classList.remove('board__cell--empty');
                }
                
                // this.cellsEl[i*3 + j].innerText = `${this.cells[i][j]}`;
                this.cellsEl[i*3 + j].classList.add(`board__cell--${this.cells[i][j]}`);
                    
            }
        }
    }


    async switchPlayer() {

        this.boardEl.classList.remove(this.players[this.currentPlayer]?.symbol);
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.boardEl.classList.add(this.players[this.currentPlayer].symbol);

        if(this.players[this.currentPlayer] instanceof HumanPlayer) {
            this.boardEl.classList.add('board--human-turn');
        } else {
            this.boardEl.classList.remove('board--human-turn');
            const c = await this.players[this.currentPlayer].move(this.cells, this.options.boardSize);
            console.log(c)
            if(c){
                this.cells[c.i][c.j] = this.players[this.currentPlayer].symbol;
            }
        }

        this.hintEl.innerHTML = `${this.players[this.currentPlayer].name}: your turn!`;


        this.status = this.checkWinner();
        this.winner = this.players[this.currentPlayer];

        //fim de jogo
        if(this.status != null) {
            // TODO mostrar tela de fim de jogo
            console.log('switch', this.status, this.winner);
        } else {
            // this.switchPlayer();
        }
    }

    async startRound() {

        this.currentPlayer = -1;

        this.winner = null;
        this.status = null;
        this.resetBoard();

        this.scoreEl.innerHTML = '';
        this.players.forEach(player => {
            const h1 = document.createElement('h1');
            h1.innerHTML = `${player.name} (${player.symbol}): 0 points`;
            this.scoreEl.appendChild(h1);
        });

        this.drawBoard();

        await this.switchPlayer();


        /////

        // const allRobots = this.players.find(player => player instanceof HumanPlayer) ? false : true;


        // if(allRobots) {
        //     //se todos robos
        //     this.boardEl.classList.remove('board--human-turn');

        //     while(this.status == null) {
        //         this.hintEl.innerHTML = `${this.players[this.currentPlayer].name}: your turn!`;
                
        //             const c = await this.players[this.currentPlayer].move(this.cells, this.options.boardSize);
        //             console.log(c)
        //             if(c){
        //                 //TODO create method for Board
        //                 this.cells[c.i][c.j] = this.players[this.currentPlayer].symbol;
        //             }
                
        
        //         this.status = this.checkWinner();
        //         this.winner = this.players[this.currentPlayer];
        //         // console.log(this.status, this.players[this.currentPlayer].name)
        //         this.switchPlayer();
        //         // console.log(this.board.cells);
        //         this.drawBoard();
        //     }
    
        //     // TODO mostrar tela de fim de jogo
        //     console.log(this.status, this.winner);
        // } else {
        //     // se todos humanos
        //     this.boardEl.classList.add('board--human-turn');
        //     this.boardEl.classList.add(this.players[this.currentPlayer].symbol);
        //     this.hintEl.innerHTML = `${this.players[this.currentPlayer].name}: your turn!`;
        // }
    }
}