export default class Player {
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
    }

    nextEmptyCell(cells, size) {
        for(let i = 0; i < size; i++) {
            for(let j = 0; j < size; j++) {
                if(cells[i][j] == '') {
                    return {i,j};
                }
            }
        }

        return null;
    }

    async move(cells, size) {
        throw new Error('move() não definido')
    }
}