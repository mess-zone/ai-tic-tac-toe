import Player from "./Player.js";

export default class Board {
    constructor() {
        this.size = 3; // 3x3
        this.cells = [];
        this.players = [ new Player('P1', 'x'), new Player('P2', 'o') ];
        this.currentPlayer = 0;
        this.winner = null;
    }

    start() {
        this.cells = [];

        for(let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for(let j = 0; j < this.size; j++) {
                this.cells[i][j] = '';
            }
        }

        this.currentPlayer = 0;
        this.winner = null;
        console.log(this.cells);
    }

    switchPlayer() {
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
    }

    checkWinner() {
        //horizontal
        if(
            (this.isEqual(this.cells[0][0], this.cells[0][1], this.cells[0][2]) && this.cells[0][0] != '') ||
            (this.isEqual(this.cells[1][0], this.cells[1][1], this.cells[1][2]) && this.cells[1][0] != '' ) ||
            (this.isEqual(this.cells[2][0], this.cells[2][1], this.cells[2][2]) && this.cells[2][0] != '' )
        ) {
            this.winner = this.players[this.currentPlayer];
            // TODO show end screen
            return;
        }

        //vertical
        if(
            (this.isEqual(this.cells[0][0], this.cells[1][0], this.cells[2][0]) && this.cells[0][0] != '' ) ||
            (this.isEqual(this.cells[0][1], this.cells[1][1], this.cells[2][1]) && this.cells[0][1] != '')||
            (this.isEqual(this.cells[0][2], this.cells[1][2], this.cells[2][2]) && this.cells[0][2] != '')
        ) {
            this.winner = this.players[this.currentPlayer];
            // TODO show end screen
            return;
        }

        //diagonal
        if(
            (this.isEqual(this.cells[0][0], this.cells[1][1], this.cells[2][2]) && this.cells[0][0] != '' ) ||
            (this.isEqual(this.cells[2][0], this.cells[1][1], this.cells[0][2])  && this.cells[2][0] != '')
        ) {
            this.winner = this.players[this.currentPlayer];
            // TODO show end screen
            return;
        }
    }

    isEqual(a, b, c) {
        return (a == b && b == c);
    }

    async move() {
        if(this.winner) {
            return;
        }

        const c = await this.players[this.currentPlayer].move(this.cells, this.size);
        console.log(c)
        if(c){
            this.cells[c.i][c.j] = this.players[this.currentPlayer].symbol;
        }

        this.checkWinner();
        console.log(this.winner)
        this.switchPlayer();
        console.log(this.cells);
        this.draw();

    }

    draw() {
        const cells = document.querySelectorAll('.board__cell');
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                cells[i*3 + j].innerText = `${this.cells[i][j]}`;
                    
            }
        }
    }
}