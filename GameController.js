import Board from './Board.js';
import Player from './Player.js';

export default class GameController {
    constructor() {
        this.players = [ new Player('P1', 'x'), new Player('P2', 'o') ];
        this.boardSize = 3; // 3x3
        this.board = new Board(this.boardSize, this.players);
    }

    async startGame() {
        const boardScreenEl = document.getElementById('board-screen');
        const scoreEl = boardScreenEl.querySelector('#score');
        const hintEl = boardScreenEl.querySelector('#hint');

        scoreEl.innerHTML = '';
        this.players.forEach(player => {
            const h1 = document.createElement('h1');
            h1.innerHTML = `${player.name} (${player.symbol}): 0 points`;
            scoreEl.appendChild(h1);
        });

        this.board.init();


        
        while(this.board.isEnded() == false) {
            hintEl.innerHTML = `${this.board.players[this.board.currentPlayer].name}: your turn!`;
            const c = await this.board.players[this.board.currentPlayer].move(this.board.cells, this.board.size);
            console.log(c)
            if(c){
                this.board.cells[c.i][c.j] = this.board.players[this.board.currentPlayer].symbol;
            }
    
            this.board.checkWinner();
            // console.log(this.board.winner)
            this.board.switchPlayer();
            // console.log(this.board.cells);
            this.board.draw();
        }

        // TODO mostrar tela de fim de jogo
        console.log(this.board.status, this.board.winner)
    }
}