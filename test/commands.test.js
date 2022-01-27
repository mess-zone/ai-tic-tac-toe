import {expect} from 'chai';
import createLogic, { createState, PlayerTypes, Symbols, GameStatus, RoundStatus } from '../src/createLogic.js'

import createCommands from '../src/createCommands.js'

describe('commands', function() {

    let logicSpy;
    let observerSpy;

    function createLogicSpy() {
        const state = { test: 'valid_state_object' };
        const params = {
            config: {
                mustThrow: false,
            },
            args: {
                setPlayers: {
                    p1: undefined,
                    p2: undefined,
                },
                move: { 
                    playerIndex: undefined, 
                    cellIndex: undefined,
                }
            },
            calls: {
                setPlayers: 0,
                resetGame: 0,
                startNextRound: 0,
                move: 0,
                checkEndOfRound: 0,
                switchPlayer: 0,
            }
        };

        const setPlayers = (player1, player2) => {
            params.calls.setPlayers++;
            params.args.setPlayers.p1 = player1;
            params.args.setPlayers.p2 = player2;

            if(params.config.mustThrow) {
                throw 'Invalid Params';
            }
        }

        const resetGame = () => {
            params.calls.resetGame++;
        }

        const startNextRound = () => {
            params.calls.startNextRound++;
            return true;
        }

        const move = (playerIndex, cellIndex) => {
            params.calls.move++;
            params.args.move = { playerIndex, cellIndex };
        }

        const checkEndOfRound = () => {
            params.calls.checkEndOfRound++;
            return false;
        }

        const switchPlayer = () => {
            params.calls.switchPlayer++;
            return true;
        }

        return {
            state,
            params,
            setPlayers,
            resetGame,
            startNextRound,
            move,
            checkEndOfRound,
            switchPlayer,
        }
    };

    function createObserverControllerSpy() {
        const params = {
            history: {
                notifyAll: [],
            },
        };

        function notifyAll(command) {
            params.history.notifyAll.push(command);
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
         
            expect(logicSpy.params.args.setPlayers.p1).to.deep.equal(command.player1);
            expect(logicSpy.params.args.setPlayers.p2).to.deep.equal(command.player2);
            expect(logicSpy.params.calls.resetGame).to.equal(1);
            expect(logicSpy.params.calls.startNextRound).to.equal(1);
            expect(observerSpy.params.history.notifyAll.length).to.equal(1);
            expect(observerSpy.params.history.notifyAll[0].id).to.equal('START_ROUND');
        });

        it('Should throw an error if receive invalid params', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.mustThrow = true;

            observerSpy = createObserverControllerSpy();

            const sut = createCommands(logicSpy, observerSpy);
            const command = { 
                id: 'SETUP', 
            };

            expect(() => sut.SETUP(command)).to.throw();
        });
    })

    describe('MOVE', function() {
        it('Should call checkEndOfRound, switchPlayer and notifyAll UPDATE_BOARD', function() {
            logicSpy = createLogicSpy();
            observerSpy = createObserverControllerSpy();

            const sut = createCommands(logicSpy, observerSpy);
            const command = { 
                id: 'MOVE',
                playerIndex: 0,
                cellIndex: 0
            };
            sut.MOVE(command);
            expect(logicSpy.params.args.move.playerIndex).to.equal(command.playerIndex);
            expect(logicSpy.params.args.move.cellIndex).to.equal(command.cellIndex);
            expect(logicSpy.params.calls.checkEndOfRound).to.equal(1);
            expect(logicSpy.params.calls.switchPlayer).to.equal(1);
            // expect(observerSpy.params.notify.id).to.equal('START_ROUND');
        });
    });
});