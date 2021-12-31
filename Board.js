export default class Board {
    constructor() {
        this.size = 3; // 3x3
        this.players = [ 'x', 'o' ];
        this.currentPlayer = 0;
        this.winner = null;
        this.cells = [];
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

    nextEmptyCell() {
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if(this.cells[i][j] == '') {
                    return {i,j};
                }
            }
        }

        return null;
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

    move() {
        if(this.winner) {
            return;
        }
        const c = this.nextEmptyCell();
        console.log(c)
        if(c){
            this.cells[c.i][c.j] = this.players[this.currentPlayer];
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