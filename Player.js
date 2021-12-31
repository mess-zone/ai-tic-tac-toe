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
        const p = this;
        
        const promise = new Promise(function(resolve, reject) {
            const nextCell = p.nextEmptyCell(cells, size);
            window.setTimeout(
                function() {
                  resolve(nextCell)
                }, Math.random() * 3000);
        });

        return promise;
    }
}