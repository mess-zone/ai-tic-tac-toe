const DRAW = 'EMPATE';
const WIN = 'VITORIA';
export default class Board {
    constructor(size) {
        this.size = size; // 3x3
        this.cells = [];

        // TODO eliminar dependencia do DOM
        this.cellsEl = document.querySelectorAll('.board__cell');
    }

    reset() {
        this.cells = [];

        for(let i = 0; i < this.size; i++) {
            this.cells[i] = [];
            for(let j = 0; j < this.size; j++) {
                this.cells[i][j] = '';
            }
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
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if(this.cells[i][j] == '') {
                    return true;
                }
            }
        }

        return false;
    }


    draw() {
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if(this.cells[i][j] == '') {
                    this.cellsEl[i*3 + j].classList.add('board__cell--empty');
                } else {
                    this.cellsEl[i*3 + j].classList.remove('board__cell--empty');
                }
                
                this.cellsEl[i*3 + j].innerText = `${this.cells[i][j]}`;
                    
            }
        }
    }
}