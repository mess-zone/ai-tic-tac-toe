export default function createCommands(viewsController) {
    
    function SETUP() {
        console.log('[ui] SETUP');
        viewsController.showStartScreen();
    }
    
    function START_ROUND(command) {
        console.log('[ui] START_ROUND');
        const state = {...command.state};
        const modelRoundScreen = {
            currentRound: state.currentRound.round + 1,
            maxRounds: state.maxRounds,
        };
        viewsController.showRoundScreen(modelRoundScreen);
    }

    return {
        SETUP,
        START_ROUND,
    }
}