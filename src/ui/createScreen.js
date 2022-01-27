import { Symbols, PlayerTypes, RoundStatus } from "../createLogic.js";

export default function createScreen(viewsController, commands) {

    let state = {};

    function init() {
        console.log('[screen] init')

        viewsController.createAllViews();

        viewsController.nodes.roundScreenEl.addEventListener("animationend", () => viewsController.showBoardScreen(state) );
        viewsController.nodes.endGameScreenEl.querySelector('.restart').addEventListener('click', () => viewsController.showStartScreen(state) );

    }

    function executeCommand(command) {
        console.log('[screen] executeCommand ', command);

        if(command.id == 'SETUP') {
            commands.SETUP(command);
        } else if(command.id == 'START_ROUND') {
            state = {...command.state};
            commands.START_ROUND(command);
        } else if(command.id == 'UPDATE_BOARD') {
            state = {...command.state};
            commands.UPDATE_BOARD(command);
        } else if(command.id == 'END_ROUND') {
            state = {...command.state};
            commands.END_ROUND(command);
        } else if(command.id == 'END_GAME') {
            state = {...command.state};
            console.log('[screen] END GAME', state);

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
            viewsController.showEndGameScreen(endGameModel);
        }
        
        console.log('[screen] current state', state)
        console.log('[screen] current state.board', state.board)
    }

    return {
        executeCommand,
        state,

        init,
    }
}
