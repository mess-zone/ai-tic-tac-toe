import {expect} from 'chai';
import createLogic, { createState, PlayerTypes, Symbols, GameStatus, RoundStatus } from '../src/createLogic.js'

import createCommands from '../src/createCommands.js'

describe('commands', function() {

    let logicSpy;
    let observerSpy;

    function createLogicSpy() {
        const state = { test: 'valid_state_object' };
        const params = {
            mustThrow: false,
        };

        const setPlayers = (player1, player2) => {
            params.p1 = player1;
            params.p2 = player2;

            if(params.mustThrow) {
                throw 'Invalid Params';
            }
        }

        const resetGame = () => {
            params.resetGame = true;
        }

        const startNextRound = () => {
            params.startNextRound = true;
            return true;
        }

        return {
            state,
            params,
            setPlayers,
            resetGame,
            startNextRound
        }
    };

    function createObserverControllerSpy() {
        const params = {};

        function notifyAll(command) {
            params.notify = command;
        }

        return {
            params,
            notifyAll,
        }

    }

    describe('SETUP', function() {

        it('Should call setPlayers, resetGame, startNextRound and notifyAll when receive valid params', function() {
            logicSpy = createLogicSpy();
            observerSpy = createObserverControllerSpy();

            const sut = createCommands(logicSpy, observerSpy);
            const command = { 
                id: 'SETUP',
                player1: { name: 'player 1', type: PlayerTypes.HUMAN }, 
                player2: { name: 'player 2', type: PlayerTypes.HUMAN } 
            };
            sut.SETUP(command);
         
            expect(logicSpy.params.p1).to.deep.equal(command.player1);
            expect(logicSpy.params.p2).to.deep.equal(command.player2);
            expect(logicSpy.params.resetGame).to.deep.equal(true);
            expect(logicSpy.params.startNextRound).to.deep.equal(true);
            expect(observerSpy.params.notify.id).to.equal('START_ROUND');
        });

        it('Should throw an error if receive invalid params', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.mustThrow = true;

            observerSpy = createObserverControllerSpy();

            const sut = createCommands(logicSpy, observerSpy);
            const command = { 
                id: 'SETUP', 
            };

            expect(() => sut.SETUP(command)).to.throw();
        });
    })

    describe('others...', function() {
        it('others commands tests');
    });
});