import { Symbols } from './helpers/constants.js';
import { WinningCombinations } from './helpers/constants.js';

export default function createMinimaxStrategy () {
    const name = 'MinimaxStrategy';

    function findBestMove(board, maximizingPlayerSymbol) {
        console.log('MinimaxStrategy finding best value', maximizingPlayerSymbol);
        let bestVal = -1000;
        const avaliablePositions = board.map((cell, index) => {return cell === Symbols.EMPTY ? index : null}).filter(cell => cell !== null);
        let bestMove = undefined;
        for(let i = 0; i < avaliablePositions.length; i++) {
            board[avaliablePositions[i]] = maximizingPlayerSymbol;
            const value = minimax(board, 0, false, maximizingPlayerSymbol);
            bestVal = Math.max(bestVal, value);
            console.log('VALUE', value, 'BEST VALUE', bestVal, 'INDEX', avaliablePositions[i])
            board[avaliablePositions[i]] = Symbols.EMPTY;

            // If the value of the current move
            // is more than the best value, then
            // update best
            if (value >= bestVal) {
                bestMove = avaliablePositions[i];
                bestVal = value;
            }
        }
        
        console.log('MINIMAX BEST VALUE', bestVal, 'BEST MOVE INDEX', bestMove);
        return bestMove;
    }

    function minimax(board, depth, isMaximizingPlayer, maximizingPlayerSymbol) {
        
        let score = evaluate(board, maximizingPlayerSymbol);
        
        // If Maximizer has won the game
        // return his/her evaluated score
        if (score == 10)
            return score;
        
        // If Minimizer has won the game
        // return his/her evaluated score
        if (score == -10)
            return score;
        
        // If there are no more moves and
        // no winner then it is a tie
        if (isMovesLeft(board) === false)
            return 0;

        // console.log('m', score, depth, isMaximizingPlayer, maximizingPlayerSymbol )
        
        if(isMaximizingPlayer) {
            // let bestVal = -Infinity;
            let bestVal = -1000;
            const avaliablePositions = getAvaliablePositions(board);
            for(let i = 0; i < avaliablePositions.length; i++) {
                board[avaliablePositions[i]] = maximizingPlayerSymbol;
                const value = minimax(board, depth+1, false, maximizingPlayerSymbol);
                bestVal = Math.max(bestVal, value);
                board[avaliablePositions[i]] = Symbols.EMPTY;
            }
            return bestVal;
        } 
        else { // is minimizing player
            // let bestVal = +Infinity;
            let bestVal = +1000;
            const avaliablePositions = getAvaliablePositions(board);
            for(let i = 0; i < avaliablePositions.length; i++) {
                board[avaliablePositions[i]] = getOpponentPlayerSymbol(maximizingPlayerSymbol);
                const value = minimax(board, depth+1, true, maximizingPlayerSymbol);
                bestVal = Math.min(bestVal, value);
                board[avaliablePositions[i]] = Symbols.EMPTY;
            }
            return bestVal;
        }
    }

    function evaluate(board, maximizingPlayerSymbol) {
        // if(!isMovesLeft(board)) {
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
            
        // } 
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
