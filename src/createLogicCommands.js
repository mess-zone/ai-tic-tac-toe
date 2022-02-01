import { PlayerTypes, RoundStatus, Symbols } from "./helpers/constants.js";

export default function createLogicCommands(logic, observable) {

    function SETUP({ player1, player2 }) { 
        logic.setPlayers(player1, player2);
        logic.resetGame();
        
        const shouldStartNextRound = logic.startNextRound();

        if(shouldStartNextRound) {
            observable.notifyAll({
                id: 'START_ROUND',
                state:  JSON.parse(JSON.stringify(logic.getState())),
            });


            // se player 1 é o computador, executar o primeiro movimento
            if(player1.type === PlayerTypes.COMPUTER) {
                const emptyCells = logic.getState().board.cells.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null)
                console.log('START PLAYER 1 É COMPUTER, se player 1 é o computador, executar o primeiro movimento ', emptyCells)
                const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
                console.log(cellIndex);
                // setTimeout(() => {
                MOVE({ playerIndex: 0, cellIndex: cellIndex });
                // }, 5000)
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
            //update screen board
            observable.notifyAll({ 
                id: 'UPDATE_BOARD', 
                state:JSON.parse(JSON.stringify(logic.getState()))
            });

            // se o round ainda não acabou...
            if(!logic.checkEndOfRound()) {
                // se o player atual é um computador, executa um movimento aleatorio
                if( logic.getState().players[logic.getState().currentRound.currentPlayer].type === PlayerTypes.COMPUTER) {
                    const emptyCells = logic.getState().board.cells.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null)
                    console.log('NEXT PLAYER É COMPUTER, movimentos disponiveis: ', emptyCells)
    
                    if(emptyCells.length > 0) {
                        const cellIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]
                        MOVE({ playerIndex: logic.getState().currentRound.currentPlayer, cellIndex: cellIndex });
                    }
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
            observable.notifyAll({
                id: 'START_ROUND',
                state: JSON.parse(JSON.stringify(logic.getState())),
            });
        }
    }

    return {
        SETUP,
        MOVE,
        START_NEXT_ROUND,
    }
}
