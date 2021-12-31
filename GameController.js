import Board from './Board.js';
import ComputerPlayer from './ComputerPlayer.js';

export default class GameController {
    constructor() {
        this.boardSize = 3; // 3x3
        this.board = new Board(this.boardSize);
        
        this.players = [ new ComputerPlayer('P1', 'x'), new ComputerPlayer('P2', 'o') ];
        this.currentPlayer = 0;
        this.winner = null;
        this.status = null;
    }

    switchPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    }

    async startGame() {
        this.currentPlayer = 0;
        this.winner = null;
        this.status = null;
        this.board.reset();

        const boardScreenEl = document.getElementById('board-screen');
        const scoreEl = boardScreenEl.querySelector('#score');
        const hintEl = boardScreenEl.querySelector('#hint');

        scoreEl.innerHTML = '';
        this.players.forEach(player => {
            const h1 = document.createElement('h1');
            h1.innerHTML = `${player.name} (${player.symbol}): 0 points`;
            scoreEl.appendChild(h1);
        });



        //move
        while(this.status == null) {
            hintEl.innerHTML = `${this.players[this.currentPlayer].name}: your turn!`;
            
            const c = await this.players[this.currentPlayer].move(this.board.cells, this.board.size);
            console.log(c)
            if(c){
                //TODO create method for Board
                this.board.cells[c.i][c.j] = this.players[this.currentPlayer].symbol;
            }
    
            this.status = this.board.checkWinner();
            this.winner = this.players[this.currentPlayer];
            // console.log(this.status, this.players[this.currentPlayer].name)
            this.switchPlayer();
            // console.log(this.board.cells);
            this.board.draw();
        }

        // TODO mostrar tela de fim de jogo
        console.log(this.status, this.winner);
    }
}