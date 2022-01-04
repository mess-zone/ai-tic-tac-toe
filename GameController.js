import ComputerPlayer from './ComputerPlayer.js';
import HumanPlayer from './HumanPlayer.js';

const DRAW = 'EMPATE';
const WIN = 'VITORIA';

const WINNING_COMBINATIONS = [
    //horizontal
    [ 0, 1, 2 ],
    [ 3, 4, 5 ],
    [ 6, 7, 8 ],
    //vertical
    [ 0, 3, 6 ],
    [ 1, 4, 7 ],
    [ 2, 5, 8 ],
    //diagonal
    [ 0, 4, 8 ],
    [ 2, 4, 6 ],
];

export default class GameController {
    constructor() {

        this.options = {
            boardSize: 3, // 3x3
            rounds: 3,
        };

        this.score = [];
        
        this.currentRound = -1;

        this.cells = [];
        
        this.players = [];
        this.currentPlayer = 0;
        this.winner = null;
        this.status = null;
        
        this.startScreenEl = document.getElementById('start-screen');
        this.roundScreenEl = document.getElementById('round-screen');
        this.endScreenEl = document.getElementById('end-screen');
        
        
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

    showEndScreen() {
        if(this.status == DRAW) {
            this.endScreenEl.querySelector('h1').innerText = `Draw!`;
        } else if(this.status == WIN) {
            this.endScreenEl.querySelector('h1').innerText = `${this.players[this.currentPlayer].name} won!`;
        }
        this.endScreenEl.classList.add('screen--show');
    }

    showBoardScreen() {
        console.log('show board screen')
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

        for(let i = 0; i < Math.pow(this.options.boardSize, 2); i++) {
            this.cells[i] = '';
        }

        this.boardEl.innerHTML = '';
        for(let i = 0; i <  this.cells.length; i++) {
                this.cells[i] = '';
                const newCell = document.createElement('div');
                newCell.classList.add('board__cell');
                newCell.dataset.i = i;
                // newCell.dataset.j = j;
                newCell.addEventListener('click', this.handleClick.bind(this));
                this.boardEl.appendChild(newCell);
        }

        this.cellsEl = this.boardEl.querySelectorAll('.board__cell');

    }

    handleClick(e) {
        // console.log(this.players[this.currentPlayer].name, 'clicou', e.target.dataset);

        //se o jogo já acabou...
        if(this.status != null) {
            return;
        }
        
        const c = e.target.dataset;
        // console.log(c)
        if(c != null){
            this.cells[c.i] = this.players[this.currentPlayer].symbol;
        }

        this.drawBoard();
        
        this.status = this.checkWinner();
        this.winner = this.players[this.currentPlayer];

        //fim de jogo
        if(this.status != null) {
            // TODO mostrar tela de fim de jogo
            console.log(this.status, this.winner);
            // this.startNewRound();
            this.hintEl.innerHTML = '';
            this.score[this.currentPlayer].points++;
            console.log(this.score)
            this.showEndScreen();
        } else {
            this.switchPlayer();
        }

    }

    
    checkWinner() {
        const symbol =  this.players[this.currentPlayer].symbol;
        let hasWinner = false;
        for(let i = 0; i < WINNING_COMBINATIONS.length && hasWinner == false; i++) {

           hasWinner = WINNING_COMBINATIONS[i].every(index => this.cells[index] == symbol);
    
           if(hasWinner == true) {
               WINNING_COMBINATIONS[i].forEach(index => {
                   this.cellsEl[index].classList.add('board__cell--highlight');
               });
               return WIN;
           }
        }

        // checa empate
        if(!this.hasEmptyCells()) {
            return DRAW;
        }

        // TODO NÃO GOSTO DE RETORNAR NULL, CRIAR UM STATUS PARA JOGO EM ANDAMENTO
        // jogo não acabou
        return null;
    }

    hasEmptyCells() {
        for(let i = 0; i < this.cells.length; i++) {
            if(this.cells[i] == '') {
                return true;
            }
        }

        return false;
    }

    drawBoard() {
        for(let i = 0; i < this.cells.length; i++) {
            if(this.cells[i] == '') {
                this.cellsEl[i].classList.add('board__cell--empty');
            } else {
                this.cellsEl[i].classList.remove('board__cell--empty');
                this.cellsEl[i].classList.add(`board__cell--${this.cells[i]}`);
            }                   
        }
    }


    async switchPlayer() {
        console.log('switch player')
        this.boardEl.classList.remove(this.players[this.currentPlayer]?.symbol);
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        this.boardEl.classList.add(this.players[this.currentPlayer].symbol);
        this.hintEl.innerHTML = `${this.players[this.currentPlayer].name}: your turn!`;


        if(this.players[this.currentPlayer] instanceof HumanPlayer) {
            this.boardEl.classList.add('board--human-turn');
        } else {
            this.boardEl.classList.remove('board--human-turn');

            // TODO refatorar
            const index = await this.players[this.currentPlayer].move(this.cells, this.options.boardSize);
            console.log('robot cell',index)
            if(index !== null){
                this.cells[index] = this.players[this.currentPlayer].symbol;
            }

            this.drawBoard();
            this.status = this.checkWinner();
            this.winner = this.players[this.currentPlayer];
    
            //fim de jogo
            if(this.status != null) {
                // TODO mostrar tela de fim de jogo
                console.log('switch', this.status, this.winner);
                // this.startNewRound();
                this.hintEl.innerHTML = '';
                this.score[this.currentPlayer].points++;
                console.log(this.score)
                this.showEndScreen();
            } else {
                this.switchPlayer();
            }
        }




    }

    async startRound() {

        this.currentPlayer = -1;

        this.winner = null;
        this.status = null;
        this.resetBoard();

        this.score = [
            { label: this.players[0].name , points: 0 },
            { label: this.players[1].name , points: 0 },
            { label: 'Draws' , points: 0 },
        ];

        this.scoreEl.innerHTML = '';

        const roundCounterEl = document.createElement('h1');
        roundCounterEl.innerHTML = `Round: ${this.currentRound + 1}/${this.options.rounds}`;
        this.scoreEl.appendChild(roundCounterEl);

        // this.players.forEach(player => {
        //     const h1 = document.createElement('h1');
        //     h1.innerHTML = `${player.name} (${player.symbol}): 0`;
        //     this.scoreEl.appendChild(h1);
        // });

        this.score.forEach(element => {
            const h1 = document.createElement('h1');
            h1.innerHTML = `${element.label}: ${element.points}`;
            this.scoreEl.appendChild(h1);
        });
        // const drawsCountEl = document.createElement('h1');
        // drawsCountEl.innerHTML = `Draws: ${this.score.draws}`;
        // this.scoreEl.appendChild(drawsCountEl);

        this.drawBoard();

        await this.switchPlayer();
    }
}