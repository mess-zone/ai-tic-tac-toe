export default function createLogicCommands(logic, observable) {

    function SETUP({ player1, player2 }) { 
        logic.setPlayers(player1, player2);
        logic.resetGame();
        
        const shouldStartNextRound = logic.startNextRound();

        if(shouldStartNextRound) {
            observable.notifyAll({
                id: 'START_ROUND',
                state: logic.getState(),
            });
        }
    }

    function MOVE({ playerIndex, cellIndex }) {
        logic.move(playerIndex, cellIndex);
        
        const isEndOfRound = logic.checkEndOfRound();
        
        if(isEndOfRound) {
            //update screen board
            observable.notifyAll({ 
                id: 'END_ROUND', 
                state: logic.getState()
            });

            return;
        }

        const isSwitch = logic.switchPlayer();
        if(isSwitch) {
            //update screen board
            observable.notifyAll({ 
                id: 'UPDATE_BOARD', 
                state:logic.getState()
            });
        }

    }

    function START_NEXT_ROUND(command) {
        const isEndOfGame = logic.checkEndOfGame();
        if(isEndOfGame) {
            observable.notifyAll({
                id: 'END_GAME',
                state: logic.getState(),
            });
            return;
        }
            
        const shouldStartNextRound = logic.startNextRound();

        if(shouldStartNextRound) {
            observable.notifyAll({
                id: 'START_ROUND',
                state: logic.getState(),
            });
        }
    }

    return {
        SETUP,
        MOVE,
        START_NEXT_ROUND,
    }
}
