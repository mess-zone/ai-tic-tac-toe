import {expect} from 'chai';
import createViewCommands from '../src/createViewCommands.js';

function createViewsSpy() {
    const params = {
        args: {
            showRoundScreen: {
                model: {},
            },
            updateBoardInfo: {
                model: {},
            }
        },
        calls: {
            showStartScreen: 0,
            updateBoardInfo: 0,
            showRoundScreen: 0,
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

    return {
        params,
        showStartScreen,
        updateBoardInfo,
        showRoundScreen,
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
                id: 'START_ROUND',
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
});