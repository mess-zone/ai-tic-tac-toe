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
                checkEndOfRound: {
                    isEnd: false,
                },
                switchPlayer: {
                    isSwitch: true,
                },
                checkEndOfGame: {
                    isEnd: false,
                },
                startNextRound: {
                    isStart: true,
                },
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
                checkEndOfGame: 0,
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
            return params.config.startNextRound.isStart;
        }

        const move = (playerIndex, cellIndex) => {
            params.calls.move++;
            params.args.move = { playerIndex, cellIndex };
        }

        const checkEndOfRound = () => {
            params.calls.checkEndOfRound++;
            return params.config.checkEndOfRound.isEnd;
        }

        const switchPlayer = () => {
            params.calls.switchPlayer++;
            return params.config.switchPlayer.isSwitch;
        }

        const checkEndOfGame = () => {
            params.calls.checkEndOfGame++;
            return params.config.checkEndOfGame.isEnd;
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
            checkEndOfGame,
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
            expect(observerSpy.params.history.notifyAll[0].id).to.equal('UPDATE_BOARD');
        });

        it('Should call checkEndOfRound and notifyAll END_ROUND', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.checkEndOfRound.isEnd = true;
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
            expect(logicSpy.params.calls.switchPlayer).to.equal(0);
            expect(observerSpy.params.history.notifyAll[0].id).to.equal('END_ROUND');
        });

        it('Should call checkEndOfRound, switchPlayer', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.switchPlayer.isSwitch = false;
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
            expect(observerSpy.params.history.notifyAll.length).to.equal(0);
        });
    });

    describe('START_NEXT_ROUND', function() {
        
        it('Should call checkEndOfGame, startNextRound and notifyAll START_ROUND', function() {
            logicSpy = createLogicSpy();
            observerSpy = createObserverControllerSpy();

            const sut = createCommands(logicSpy, observerSpy);
            const command = { 
                id: 'START_NEXT_ROUND',
            };
            sut.START_NEXT_ROUND(command);

            expect(logicSpy.params.calls.checkEndOfGame).to.equal(1);
            expect(logicSpy.params.calls.startNextRound).to.equal(1);
            expect(observerSpy.params.history.notifyAll[0].id).to.equal('START_ROUND');
        });
        
        it('Should call checkEndOfGame, startNextRound and notifyAll END_GAME', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.checkEndOfGame.isEnd = true;
            observerSpy = createObserverControllerSpy();

            const sut = createCommands(logicSpy, observerSpy);
            const command = { 
                id: 'START_NEXT_ROUND',
            };
            sut.START_NEXT_ROUND(command);

            expect(logicSpy.params.calls.checkEndOfGame).to.equal(1);
            expect(logicSpy.params.calls.startNextRound).to.equal(0);
            expect(observerSpy.params.history.notifyAll[0].id).to.equal('END_GAME');
        });
        
        it('Should call checkEndOfGame, startNextRound', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.startNextRound.isStart = false;
            observerSpy = createObserverControllerSpy();

            const sut = createCommands(logicSpy, observerSpy);
            const command = { 
                id: 'START_NEXT_ROUND',
            };
            sut.START_NEXT_ROUND(command);

            expect(logicSpy.params.calls.checkEndOfGame).to.equal(1);
            expect(logicSpy.params.calls.startNextRound).to.equal(1);
            expect(observerSpy.params.history.notifyAll.length).to.equal(0);
        });
    });
});