import {expect} from 'chai';
import createViewCommands from '../src/createViewCommands.js';
import { RoundStatus } from "../src/helpers/constants.js";

function createViewsSpy() {
    const params = {
        args: {
            showRoundScreen: {
                model: {},
            },
            updateBoardInfo: {
                model: {},
            },
            showEndRoundScreen: {
                model: {},
            }
        },
        calls: {
            showStartScreen: 0,
            updateBoardInfo: 0,
            showRoundScreen: 0,
            showEndRoundScreen: 0,
        }
    };

    function showStartScreen() {
        params.calls.showStartScreen++;
    }

    function updateBoardInfo(model) {
        params.args.updateBoardInfo.model = model;
        params.calls.updateBoardInfo++;
    }

    function showRoundScreen(model) {
        params.args.showRoundScreen.model = model;
        params.calls.showRoundScreen++;
    }

    function showEndRoundScreen(model) {
        params.args.showEndRoundScreen.model = model;
        params.calls.showEndRoundScreen++;
    }


    return {
        params,
        showStartScreen,
        updateBoardInfo,
        showRoundScreen,
        showEndRoundScreen,
    };
}

describe('ViewComands', function() {
    let viewsSpy;

    describe('SETUP', function() {
        it('Should call showStartScreen', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'SETUP',
            };
            sut.SETUP(command);

            expect(viewsSpy.params.calls.showStartScreen).to.equal(1);
        });
    });

    describe('START_ROUND', function() {
        it('Should call updateBoardInfo and showRoundScreen', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'START_ROUND',
                state: {
                    currentRound: {
                        round: 0,
                    },
                    maxRounds: 3,
                },
            };
            sut.START_ROUND(command);

            const {state} = command;
            expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
            expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
            expect(viewsSpy.params.calls.showRoundScreen).to.equal(1);
            expect(viewsSpy.params.args.showRoundScreen.model).to.deep.equal({
                currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            });
        });
    });

    describe('UPDATE_BOARD', function() {
        it('Should call updateBoardInfo', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'UPDATE_BOARD',
                state: {
                    currentRound: {
                        round: 0,
                    },
                    maxRounds: 3,
                },
            };
            sut.UPDATE_BOARD(command);

            const {state} = command;
            expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
            expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
        });
    });

    describe('END_ROUND', function() {
        it('Should call updateBoardInfo and showEndRoundScreen', function() {
            viewsSpy = createViewsSpy();
            const sut = createViewCommands(viewsSpy);

            const command = {
                id: 'END_ROUND',
                state: {
                    currentRound: {
                        round: 0,
                        statusRound:  RoundStatus.WIN,
                        currentPlayer: 0,
                    },
                    maxRounds: 3,
                    players: [
                        {
                            name: 'player 1',
                        }
                    ]
                },
            };
            sut.END_ROUND(command);

            const {state} = command;
            expect(viewsSpy.params.calls.updateBoardInfo).to.equal(1);
            expect(viewsSpy.params.args.updateBoardInfo.model).to.deep.equal(state);
            expect(viewsSpy.params.calls.showEndRoundScreen).to.equal(1);
            expect(viewsSpy.params.args.showEndRoundScreen.model).to.deep.equal({
                text: state.currentRound.statusRound == RoundStatus.WIN ? `${state.players[state.currentRound.currentPlayer].name} won!` : 'Draw!',
            });
        });
    });
});