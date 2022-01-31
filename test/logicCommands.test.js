import {expect} from 'chai';
import { PlayerTypes } from '../src/helpers/constants.js';
import createLogicCommands from '../src/createLogicCommands.js';

function createLogicSpy() {
    // const state = { test: 'valid_state_object' };
    const state = {
        currentRound: {
            currentPlayer: 1,
        },
        players: [
            {
                type: 'HUMAN',
                symbol: 'X'
            },
            {
                type: 'HUMAN',
                symbol: 'O'
            }
        ]
    };

    const params = {
        config: {
            mustThrow: false,
            checkEndOfRound: {
                isEnd: false,
            },
            switchPlayerTurn: {
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
            switchPlayerTurn: 0,
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

    const switchPlayerTurn = () => {
        params.calls.switchPlayerTurn++;
        return params.config.switchPlayerTurn.isSwitch;
    }

    const checkEndOfGame = () => {
        params.calls.checkEndOfGame++;
        return params.config.checkEndOfGame.isEnd;
    }

    const getState = () => {
        return state;
    };

    return {
        params,
        getState,
        setPlayers,
        resetGame,
        startNextRound,
        move,
        checkEndOfRound,
        switchPlayerTurn,
        checkEndOfGame,
    }
}

function createObservableSpy() {
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

describe('LogicCommands', function() {

    let logicSpy;
    let observableSpy;


    describe('SETUP', function() {

        it('Should call setPlayers, resetGame, startNextRound and notifyAll START_ROUND when receive valid params', function() {
            logicSpy = createLogicSpy();
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
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
            expect(observableSpy.params.history.notifyAll.length).to.equal(1);
            expect(observableSpy.params.history.notifyAll[0].id).to.equal('START_ROUND');
        });

        it('[first move] If player 1 is a computer, also should call MOVE and notifyAll UPDATE_BOARD', function() {

            logicSpy = createLogicSpy();
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'SETUP',
                player1: { name: 'robot', type: PlayerTypes.COMPUTER }, 
                player2: { name: 'animal', type: PlayerTypes.HUMAN } 
            };
            sut.SETUP(command);
         
            // expect(logicSpy.params.args.setPlayers.p1).to.deep.equal(command.player1);
            // expect(logicSpy.params.args.setPlayers.p2).to.deep.equal(command.player2);
            // expect(logicSpy.params.calls.resetGame).to.equal(1);
            // expect(logicSpy.params.calls.startNextRound).to.equal(1);



            // expect(observableSpy.params.history.notifyAll.length).to.equal(2);
            expect(observableSpy.params.history.notifyAll[0].id).to.equal('START_ROUND');
            

            // setTimeout(function() {
            /* COMPUTER FIRST MOVE */
            expect(logicSpy.params.calls.move).to.equal(1);
            expect(logicSpy.params.args.move.playerIndex).to.equal(0);
            expect(logicSpy.params.args.move.cellIndex).to.equal(0);
            expect(logicSpy.params.calls.checkEndOfRound).to.equal(1);
            expect(logicSpy.params.calls.switchPlayerTurn).to.equal(1);
            expect(observableSpy.params.history.notifyAll.length).to.equal(2);
            expect(observableSpy.params.history.notifyAll[1].id).to.equal('UPDATE_BOARD');
       
                // done();
            // }, 6000)
        });

        it('Should throw an error if receive invalid params', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.mustThrow = true;

            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'SETUP', 
            };

            expect(() => sut.SETUP(command)).to.throw();
        });
    })

    describe('MOVE', function() {
        it('Should call checkEndOfRound, switchPlayerTurn and notifyAll UPDATE_BOARD', function() {
            logicSpy = createLogicSpy();
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'MOVE',
                playerIndex: 0,
                cellIndex: 0
            };
            sut.MOVE(command);
            expect(logicSpy.params.args.move.playerIndex).to.equal(command.playerIndex);
            expect(logicSpy.params.args.move.cellIndex).to.equal(command.cellIndex);
            expect(logicSpy.params.calls.checkEndOfRound).to.equal(1);
            expect(logicSpy.params.calls.switchPlayerTurn).to.equal(1);
            expect(observableSpy.params.history.notifyAll[0].id).to.equal('UPDATE_BOARD');
        });

        it('Should call checkEndOfRound and notifyAll END_ROUND', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.checkEndOfRound.isEnd = true;
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'MOVE',
                playerIndex: 0,
                cellIndex: 0
            };
            sut.MOVE(command);
            expect(logicSpy.params.args.move.playerIndex).to.equal(command.playerIndex);
            expect(logicSpy.params.args.move.cellIndex).to.equal(command.cellIndex);
            expect(logicSpy.params.calls.checkEndOfRound).to.equal(1);
            expect(logicSpy.params.calls.switchPlayerTurn).to.equal(0);
            expect(observableSpy.params.history.notifyAll[0].id).to.equal('END_ROUND');
        });

        it('Should call checkEndOfRound, switchPlayerTurn', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.switchPlayerTurn.isSwitch = false;
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'MOVE',
                playerIndex: 0,
                cellIndex: 0
            };
            sut.MOVE(command);
            expect(logicSpy.params.args.move.playerIndex).to.equal(command.playerIndex);
            expect(logicSpy.params.args.move.cellIndex).to.equal(command.cellIndex);
            expect(logicSpy.params.calls.checkEndOfRound).to.equal(1);
            expect(logicSpy.params.calls.switchPlayerTurn).to.equal(1);
            expect(observableSpy.params.history.notifyAll.length).to.equal(0);
        });

        it.skip('[current player is human] Should call MOVE again for the computer turn', function() {

            logicSpy = createLogicSpy();
            logicSpy.getState().players[1].type = 'COMPUTER';
            // logicSpy.params.config.switchPlayerTurn.isSwitch = false;
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'MOVE',
                playerIndex: 0,
                cellIndex: 0
            };
            sut.MOVE(command);
            expect(logicSpy.params.args.move.playerIndex).to.equal(command.playerIndex);
            expect(logicSpy.params.args.move.cellIndex).to.equal(command.cellIndex);
            expect(logicSpy.params.calls.checkEndOfRound).to.equal(1);
            expect(logicSpy.params.calls.switchPlayerTurn).to.equal(1);
            expect(observableSpy.params.history.notifyAll.length).to.equal(1);

      
                /* COMPUTER MOVE */
                expect(logicSpy.params.calls.move).to.equal(2);
                expect(logicSpy.params.args.move.playerIndex).to.equal(1);
                expect(logicSpy.params.args.move.cellIndex).to.equal(8);
                expect(logicSpy.params.calls.checkEndOfRound).to.equal(2);
                expect(logicSpy.params.calls.switchPlayerTurn).to.equal(2);
                expect(observableSpy.params.history.notifyAll.length).to.equal(2);
                expect(observableSpy.params.history.notifyAll[1].id).to.equal('UPDATE_BOARD');
       
         
        
        });
    });

    describe('START_NEXT_ROUND', function() {
        
        it('Should call checkEndOfGame, startNextRound and notifyAll START_ROUND', function() {
            logicSpy = createLogicSpy();
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'START_NEXT_ROUND',
            };
            sut.START_NEXT_ROUND(command);

            expect(logicSpy.params.calls.checkEndOfGame).to.equal(1);
            expect(logicSpy.params.calls.startNextRound).to.equal(1);
            expect(observableSpy.params.history.notifyAll[0].id).to.equal('START_ROUND');
        });
        
        it('Should call checkEndOfGame, startNextRound and notifyAll END_GAME', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.checkEndOfGame.isEnd = true;
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'START_NEXT_ROUND',
            };
            sut.START_NEXT_ROUND(command);

            expect(logicSpy.params.calls.checkEndOfGame).to.equal(1);
            expect(logicSpy.params.calls.startNextRound).to.equal(0);
            expect(observableSpy.params.history.notifyAll[0].id).to.equal('END_GAME');
        });
        
        it('Should call checkEndOfGame, startNextRound', function() {
            logicSpy = createLogicSpy();
            logicSpy.params.config.startNextRound.isStart = false;
            observableSpy = createObservableSpy();

            const sut = createLogicCommands(logicSpy, observableSpy);
            const command = { 
                id: 'START_NEXT_ROUND',
            };
            sut.START_NEXT_ROUND(command);

            expect(logicSpy.params.calls.checkEndOfGame).to.equal(1);
            expect(logicSpy.params.calls.startNextRound).to.equal(1);
            expect(observableSpy.params.history.notifyAll.length).to.equal(0);
        });
    });
});