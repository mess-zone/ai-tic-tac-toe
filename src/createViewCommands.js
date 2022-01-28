import { Symbols, RoundStatus } from "./helpers/constants.js";

export default function createCommands(views) {

    function SETUP(command) {
        console.log('[ui] SETUP');
        views.showStartScreen();
    }
    
    function START_ROUND(command) {
        console.log('[ui] START_ROUND');
        const state = {...command.state};

        views.updateBoardInfo(state);

        const modelRoundScreen = {
            currentRound: state.currentRound.round + 1,
            maxRounds: state.maxRounds,
        };
        views.showRoundScreen(modelRoundScreen);
    }

    function UPDATE_BOARD(command) {
        console.log('[iu] UPDATE BOARD');
        const state = {...command.state};

        views.updateBoardInfo(state);
    }

    function END_ROUND(command) {
        console.log('[ui] END ROUND');
        const state = {...command.state};

        views.updateBoardInfo(state);

        const endRoundScreenModel = {
            text: state.currentRound.statusRound == RoundStatus.WIN ? `${state.players[state.currentRound.currentPlayer].name} won!` : 'Draw!',
        };
        views.showEndRoundScreen(endRoundScreenModel);
    }

    function END_GAME(command) {
        console.log('[ui] END GAME');
        const state = {...command.state};

        const endGameModel = {
            round: {
                // currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            },
            X: {
                name: state.players[0].name,
                symbol: state.players[0].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 ),
            },
            O: {
                name: state.players[1].name,
                symbol: state.players[1].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 ),
            },
            draws: {
                name: 'Draws',
                symbol: '',
                points: state.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 ),
            },
        };
        views.showEndGameScreen(endGameModel);
    }

    return {
        SETUP,
        START_ROUND,
        UPDATE_BOARD,
        END_ROUND,
        END_GAME,
    }
}