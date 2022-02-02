import {expect} from 'chai';
import { Symbols } from '../src/helpers/constants.js';

function createRandomStrategy () {
    function calculateNextMove(cells) {
        const avaliabePositions = cells.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null)
        const bestMoveIndex = avaliabePositions[Math.floor(Math.random() * avaliabePositions.length)]
        return bestMoveIndex;
    }
    return {
        calculateNextMove,
    }
}

function createGameStrategyManager() {
    const strategies = [];

    function addStrategy(strategy) {
        strategies.push(strategy)
    }

    return {
        addStrategy,
    }
}

describe('RandomStrategy', () => {
    it('If the board is fully empty, should return any random position between 0 and 8', ()=> {
        const sut = createRandomStrategy();
        const currentBoard = [
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        ];
        const bestMove = sut.calculateNextMove(currentBoard);
        expect(bestMove).to.not.equal(undefined);
        expect(bestMove).to.be.at.least(0);
        expect(bestMove).to.be.at.most(8);
    })

    it('If the board is almost filled, should return the only avaliable position', ()=> {
        const sut = createRandomStrategy();
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.X, 
            Symbols.X, Symbols.X, Symbols.EMPTY, 
            Symbols.X, Symbols.X, Symbols.X, 
        ];
        const bestMove = sut.calculateNextMove(currentBoard);
        expect(bestMove).to.equal(5);
    })

    it('If the board is totally filled, should return undefined', ()=> {
        const sut = createRandomStrategy();
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.X, 
            Symbols.X, Symbols.X, Symbols.X, 
            Symbols.X, Symbols.X, Symbols.X, 
        ];
        const bestMove = sut.calculateNextMove(currentBoard);
        expect(bestMove).to.equal(undefined);
    })

    it('Should not return already filled positions', ()=> {
        const sut = createRandomStrategy();
        const currentBoard = [
            Symbols.X, Symbols.EMPTY, Symbols.O, 
            Symbols.EMPTY, Symbols.X, Symbols.EMPTY, 
            Symbols.O, Symbols.EMPTY, Symbols.X, 
        ];
        const bestMove = sut.calculateNextMove(currentBoard);
        expect(bestMove).to.not.equal(0);
        expect(bestMove).to.not.equal(2);
        expect(bestMove).to.not.equal(4);
        expect(bestMove).to.not.equal(6);
        expect(bestMove).to.not.equal(8);
    })
})

describe('GameStrategyManager', () => {
    it('test', ()=> {
        const sut = createGameStrategyManager();
        const randomStrategy = createRandomStrategy();
        sut.addStrategy(randomStrategy);
    })
})