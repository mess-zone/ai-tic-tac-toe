import {expect} from 'chai';
import createMinimaxStrategy from '../src/createMinimaxStrategy.js';
import { Symbols } from '../src/helpers/constants.js';

describe.skip('MinimaxStrategy', () => {
    it('Should have a name', ()=> {
        const sut = createMinimaxStrategy();
        expect(sut.name).to.equal('MinimaxStrategy');
    })

    it.skip('The board is totaly filled and minimax should return 10', ()=> {
        const sut = createMinimaxStrategy();
        // const currentBoard = [
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        // ];
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.O, 
            Symbols.X, Symbols.O, Symbols.O, 
            Symbols.X, Symbols.X, Symbols.X, 
        ];
        // era a vez de X (maximizer) e ele ganhou, deve retornar score 10
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.be.equal(10);
    })

    it.skip('The board is totaly filled and minimax should return -10', ()=> {
        const sut = createMinimaxStrategy();
        // const currentBoard = [
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        // ];
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.O, 
            Symbols.X, Symbols.O, Symbols.O, 
            Symbols.O, Symbols.X, Symbols.O, 
        ];
        // era a vez de O (minimizer) e ele ganhou, deve retornar score -10
        const bestMove = sut.findBestMove(currentBoard, Symbols.O);
        expect(bestMove).to.equal(-10);
    })

    it.skip('The board is totaly filled and minimax should return 0', ()=> {
        const sut = createMinimaxStrategy();
        // const currentBoard = [
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        // ];
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.O, 
            Symbols.O, Symbols.O, Symbols.X, 
            Symbols.X, Symbols.O, Symbols.X, 
        ];
        // era a vez de X (maximizer) e ele empatou, deve retornar score 0
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.equal(0);
    })

    it('The board is almost filled and minimax should return 0', ()=> {
        const sut = createMinimaxStrategy();
        // const currentBoard = [
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        // ];
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.O, 
            Symbols.EMPTY, Symbols.O, Symbols.X, 
            Symbols.X, Symbols.O, Symbols.X, 
        ];
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.equal(10);
    })

    it.skip('The board is half filled and minimax should return 0', ()=> {
        const sut = createMinimaxStrategy();
        // const currentBoard = [
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        //     Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        // ];
        const currentBoard = [
            Symbols.X, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.X, 
            Symbols.X, Symbols.O, Symbols.X, 
        ];
        const bestMove = sut.findBestMove(currentBoard, Symbols.X);
        expect(bestMove).to.equal(10);
    })


///////////////////


    it.skip('If the board is almost filled, should return the only avaliable position', ()=> {
        const sut = createMinimaxStrategy();
        const currentBoard = [
            Symbols.X, Symbols.X, Symbols.X, 
            Symbols.X, Symbols.X, Symbols.EMPTY, 
            Symbols.X, Symbols.X, Symbols.X, 
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

    it.skip('Should not return already filled positions', ()=> {
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
