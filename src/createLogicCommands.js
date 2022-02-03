import createGameStrategyManager from "./createGameStrategyManager.js";
import createRandomStrategy from "./createRandomStrategy.js";
import { PlayerTypes, RoundStatus, Symbols } from "./helpers/constants.js";


export default function createLogicCommands(logic, observable) {

    const gameStrategyManager = createGameStrategyManager();
    const randomStrategy = createRandomStrategy();
    gameStrategyManager.addStrategy(randomStrategy);

    function SETUP({ player1, player2 }) { 
        console.log('[LOGIC] SETUP', player1, player2)
        logic.setPlayers(player1, player2);
        logic.resetGame();
        
        const shouldStartNextRound = logic.startNextRound();

        
        if(shouldStartNextRound) {
            const currentState = logic.getState();

            observable.notifyAll({
                id: 'START_ROUND',
                state:  JSON.parse(JSON.stringify(currentState)),
            });


            // se player 1 é o computador, executar o primeiro movimento
            if(player1.type === PlayerTypes.COMPUTER) {
                const cellIndex = gameStrategyManager.getStrategy('RandomStrategy').calculateNextMove(currentState.board.cells);
                console.log(cellIndex);
                MOVE({ playerIndex: 0, cellIndex: cellIndex });
            }
        }
    }

    function MOVE({ playerIndex, cellIndex }) {
        console.log('MOVE:', playerIndex, cellIndex)
        logic.move(playerIndex, cellIndex);
        
        const isEndOfRound = logic.checkEndOfRound();
        
        if(isEndOfRound) {
            //update screen board
            observable.notifyAll({ 
                id: 'END_ROUND', 
                state: JSON.parse(JSON.stringify(logic.getState()))
            });

            return;
        }

        const isSwitch = logic.switchPlayerTurn();
        if(isSwitch) {
            const currentState = logic.getState();

            //update screen board
            observable.notifyAll({ 
                id: 'UPDATE_BOARD', 
                state:JSON.parse(JSON.stringify(currentState))
            });

            // se o round ainda não acabou...
            if(!logic.checkEndOfRound()) {
                // se o player atual é um computador, executa um movimento aleatorio
                if( currentState.players[currentState.currentRound.currentPlayer].type === PlayerTypes.COMPUTER) {
                    const cellIndex = gameStrategyManager.getStrategy('RandomStrategy').calculateNextMove(currentState.board.cells);
                    console.log(cellIndex);
                    MOVE({ playerIndex: currentState.currentRound.currentPlayer, cellIndex: cellIndex });
                }
            }

        }

    }

    function START_NEXT_ROUND(command) {
        const isEndOfGame = logic.checkEndOfGame();
        if(isEndOfGame) {
            observable.notifyAll({
                id: 'END_GAME',
                state: JSON.parse(JSON.stringify(logic.getState())),
            });
            return;
        }
            
        const shouldStartNextRound = logic.startNextRound();

        if(shouldStartNextRound) {
            const currentState = logic.getState();

            observable.notifyAll({
                id: 'START_ROUND',
                state: JSON.parse(JSON.stringify(currentState)),
            });

            // se o player atual é um computador, executa um movimento aleatorio
            if(currentState.players[currentState.currentRound.currentPlayer].type === PlayerTypes.COMPUTER) {
                const cellIndex = gameStrategyManager.getStrategy('RandomStrategy').calculateNextMove(currentState.board.cells);
                console.log(cellIndex);
                MOVE({ playerIndex: currentState.currentRound.currentPlayer, cellIndex: cellIndex });
            }
        }
    }

    return {
        SETUP,
        MOVE,
        START_NEXT_ROUND,
    }
}
