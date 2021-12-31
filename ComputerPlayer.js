import Player from "./Player.js";

export default class ComputerPlayer extends Player {
    constructor(name, symbol) {
        super(name, symbol);
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