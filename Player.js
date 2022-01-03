export default class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }

    // TODO refactor
    nextEmptyCell(cells, size) {
        for(let i = 0; i < cells.length; i++) {
            if(cells[i] == '') {
                return i;
            }   
        }

        return null;
    }

    async move(cells, size) {
        throw new Error('move() não definido')
    }
}