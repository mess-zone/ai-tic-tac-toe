import {expect} from 'chai';
import createMinimaxStrategy from '../src/createMinimaxStrategy.js';
import { Symbols } from '../src/helpers/constants.js';

describe('MinimaxStrategy', () => {
    it('Should have a name', ()=> {
        const sut = createMinimaxStrategy();
        expect(sut.name).to.equal('MinimaxStrategy');
    })

    it('X turn, win, should return undefined', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.O, 
            Symbols.X, Symbols.O, Symbols.O, 
            Symbols.X, Symbols.X, Symbols.X, 
        ];
        // era a vez de X e ele ganhou, minimax deve retornar score 10
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.be.equal(undefined);
    })

    it('O turn, loss, should return undefined', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.O, 
            Symbols.X, Symbols.O, Symbols.O, 
            Symbols.X, Symbols.X, Symbols.X, 
        ];
        // era a vez de O e ele perdeu, minimax deve retornar score 10
        const bestMove = sut.findBestMove(currentBoard, Symbols.O);
        expect(bestMove).to.be.equal(undefined);
    })

    it('X turn, draw, should return undefined', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.O, 
            Symbols.O, Symbols.O, Symbols.X, 
            Symbols.X, Symbols.O, Symbols.X, 
        ];
        // era a vez de X e ele empatou, minimax deve retornar score 0
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.be.equal(undefined);
    })

    it('Dumb decision', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.EMPTY, Symbols.X, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.X, 
            Symbols.O, Symbols.O, Symbols.X, 
        ];
        // expected smart: 2
        //expect dumb: 4
        const bestMove = sut.findBestMove(currentBoard, Symbols.O);
        expect(bestMove).to.be.equal(4);
        expect(bestMove).to.not.be.equal(2);
    })


/////////////////// generic tests


    it('If the board is almost filled, should return the only avaliable position', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.X, Symbols.O, Symbols.X, 
            Symbols.O, Symbols.X, Symbols.EMPTY, 
            Symbols.O, Symbols.X, Symbols.O, 
        ];
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.equal(5);
    })

    it('If the board is totally filled, should return undefined', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.X, 
            Symbols.X, Symbols.X, Symbols.X, 
            Symbols.X, Symbols.X, Symbols.X, 
        ];
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.equal(undefined);
    })

    it('Should not return already filled positions', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.X, Symbols.EMPTY, Symbols.O, 
            Symbols.EMPTY, Symbols.X, Symbols.EMPTY, 
            Symbols.O, Symbols.EMPTY, Symbols.X, 
        ];
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.not.equal(0);
        expect(bestMove).to.not.equal(2);
        expect(bestMove).to.not.equal(4);
        expect(bestMove).to.not.equal(6);
        expect(bestMove).to.not.equal(8);
    })
})
