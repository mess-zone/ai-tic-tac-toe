const DRAW = 'EMPATE';
const WIN = 'VITORIA';
export default class Board {
    constructor(size, players) {
        this.size = size; // 3x3
        this.cells = [];
        this.players = players;
        this.currentPlayer = 0;
        this.winner = null;
        this.status = null;
    }

    init() {

        this.cells = [];

        for(let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for(let j = 0; j < this.size; j++) {
                this.cells[i][j] = '';
            }
        }

        this.currentPlayer = 0;
        this.winner = null;
        this.status = null;
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
            this.status = WIN;
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
            this.status = WIN;
            // TODO show end screen
            return;
        }

        //diagonal
        if(
            (this.isEqual(this.cells[0][0], this.cells[1][1], this.cells[2][2]) && this.cells[0][0] != '' ) ||
            (this.isEqual(this.cells[2][0], this.cells[1][1], this.cells[0][2])  && this.cells[2][0] != '')
        ) {
            this.winner = this.players[this.currentPlayer];
            this.status = WIN;
            // TODO show end screen
            return;
        }

        // checa empate
        if(!this.hasEmptyCells()) {
            this.winner = null;
            this.status = DRAW;
        }
    }

    isEqual(a, b, c) {
        return (a == b && b == c);
    }

    hasEmptyCells() {
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if(this.cells[i][j] == '') {
                    return true;
                }
            }
        }

        return false;
    }

    hasWinner() {
        return this.winner != null;
    }

    isEnded() {
        return this.status != null;
    }

    async move() {
        if(this.status != null) {
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