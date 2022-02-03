import { Symbols } from './helpers/constants.js';

export default function createRandomStrategy () {
    const name = 'RandomStrategy';

    function calculateNextMove(cells) {
        const avaliabePositions = cells.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null)
        const bestMoveIndex = avaliabePositions[Math.floor(Math.random() * avaliabePositions.length)]
        return bestMoveIndex;
    }
    return {
        name,
        calculateNextMove,
    }
}
