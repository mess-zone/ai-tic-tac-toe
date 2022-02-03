import {expect} from 'chai';
import createRandomStrategy from '../src/createRandomStrategy.js';
import { Symbols } from '../src/helpers/constants.js';

describe('RandomStrategy', () => {
    it('Should have a name', ()=> {
        const sut = createRandomStrategy();
        expect(sut.name).to.equal('RandomStrategy');
    })

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
