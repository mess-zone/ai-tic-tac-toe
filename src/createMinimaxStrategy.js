import { Symbols } from './helpers/constants.js';
import { WinningCombinations } from './helpers/constants.js';

export default function createMinimaxStrategy () {
    const name = 'MinimaxStrategy';

    let maximizingPlayerSymbol;

    function findBestMove(board, maximizingSymbol) {
        maximizingPlayerSymbol = maximizingSymbol;
        // console.log('MinimaxStrategy finding best value', maximizingPlayerSymbol);
        let bestVal = -1000;
        let bestMove = undefined;
        const avaliablePositions = getAvaliablePositions(board);
        avaliablePositions.forEach(cellIndex => {
            board[cellIndex] = maximizingPlayerSymbol;
            const value = minimax(board, 0, false);
            bestVal = Math.max(bestVal, value);
            // console.log('VALUE', value, 'BEST VALUE', bestVal, 'cellINDEX', avaliablePositions[i])
            board[cellIndex] = Symbols.EMPTY;

            // If the value of the current move
            // is more than the best value, then
            // update best
            if (value >= bestVal) {
                bestMove = cellIndex;
                bestVal = value;
            }
        });
        return bestMove;
    }

    function minimax(board, depth, isMaximizingPlayer) {
        
        let score = evaluate(board);
        
        // If Maximizer has won the game
        // return his/her evaluated score
        if (score == 10)
            return score - depth;
        
        // If Minimizer has won the game
        // return his/her evaluated score
        if (score == -10)
            return depth - score;
        
        // If there are no more moves and
        // no winner then it is a tie
        if (isMovesLeft(board) === false)
            return 0;

        // console.log('m', score, depth, isMaximizingPlayer, maximizingPlayerSymbol )
        
        if(isMaximizingPlayer) {
            let bestVal = -1000;
            const avaliablePositions = getAvaliablePositions(board);
            avaliablePositions.forEach(cellIndex => {
                board[cellIndex] = maximizingPlayerSymbol;
                const value = minimax(board, depth+1, false);
                bestVal = Math.max(bestVal, value);
                board[cellIndex] = Symbols.EMPTY;
            });
            return bestVal;
        } 
        else { // is minimizing player
            let bestVal = +1000;
            const avaliablePositions = getAvaliablePositions(board);
            avaliablePositions.forEach(cellIndex => {
                board[cellIndex] = getOpponentPlayerSymbol(maximizingPlayerSymbol);
                const value = minimax(board, depth+1, true);
                bestVal = Math.min(bestVal, value);
                board[cellIndex] = Symbols.EMPTY;
            });
            return bestVal;
        }
    }

    function evaluate(board) {
            const maximizingWinningCombination = searchWinningCombination(maximizingPlayerSymbol, board);
            const minimizingWinningCombination = searchWinningCombination(getOpponentPlayerSymbol(maximizingPlayerSymbol), board);

            // console.log(maximizingWinningCombination)
            // console.log(minimizingWinningCombination)
            if(maximizingWinningCombination?.length === 3) {
                // se maximizing player venceu, retorna +10
                return +10;
            } 
            if(minimizingWinningCombination?.length === 3){
                // se minimizing player venceu, retorna -10
                return -10;
            }
                
            // se o jogo está em andamento ou provavelmente empatou, retorna 0
            return 0;
            
    }

    function getOpponentPlayerSymbol(currentPlayerSymbol) {
        return (currentPlayerSymbol === Symbols.X) ? Symbols.O : Symbols.X;
    }

    function getAvaliablePositions(board) {
        return board.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null)
    }

    function isMovesLeft(board) {
        return board.some(cell => cell === Symbols.EMPTY);
    }

    function searchWinningCombination(symbol, boardCells) {
        return WinningCombinations.find((combination) => 
            combination.every(index => boardCells[index] === symbol)
        );
    }

    return {
        name,
        findBestMove,
    }
}
