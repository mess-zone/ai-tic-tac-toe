import { Symbols, PlayerTypes, RoundStatus } from "../createLogic.js";

export default function createScreen(viewsController, commands) {

    let state = {};

    function init() {
        console.log('[screen] init')

        viewsController.createAllViews();

        viewsController.nodes.roundScreenEl.addEventListener("animationend", () => viewsController.showBoardScreen(state) );
        // viewsController.nodes.endGameScreenEl.querySelector('.restart').addEventListener('click', () => viewsController.showStartScreen(state) );

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
            commands.END_GAME(command);
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
