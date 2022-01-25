
export const GameStatus = {
    SETUP: 'SETUP',
    RUNNING: 'RUNNING',
    ENDED: 'ENDED',
}

export const RoundStatus = {
    PLAYING: 'PLAYING',
    DRAW: 'DRAW',
    WIN: 'WIN',
}

export const PlayerTypes = {
    HUMAN: 'HUMAN',
    COMPUTER: 'COMPUTER',
}

export const Symbols = {
    X: 'X',
    O: 'O',
    EMPTY: '',
}

export const WINNING_COMBINATIONS = [
    //horizontal
    [ 0, 1, 2 ],
    [ 3, 4, 5 ],
    [ 6, 7, 8 ],
    //vertical
    [ 0, 3, 6 ],
    [ 1, 4, 7 ],
    [ 2, 5, 8 ],
    //diagonal
    [ 0, 4, 8 ],
    [ 2, 4, 6 ],
];

export default function createGame() {


    const state = {
        statusGame: GameStatus.SETUP,
        maxRounds: 3,
        board: {
            boardSize: 3, // 3x3
            cells: [
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
                Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            ],
        },
        currentRound: {
            round: -1,
            currentPlayer: -1,
            statusRound: null,
        },
        scores: [
            // {
            //     winner: null, combination: [0, 1, 2],
            // },
            // {
            //     winner: null, combination: [0, 1, 2],
            // },
            // {
            //     winner: null, combination: [0, 1, 2],
            // },
        ],
        players: [
            { 
                name: '',
                type: null,
                symbol: Symbols.X,
            },
            { 
                name: '',
                type: null,
                symbol: Symbols.O,
            }
        ],
    };

    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    function executeCommand(command) {
        console.log('[game] executeCommand ', command);

        if(command.id == 'SETUP') {
            setupCommand(command.player1, command.player2)
        } else if(command.id == 'MOVE') {
            moveCommand(command.playerIndex, command.cellIndex);
        } else if(command.id == 'START_NEXT_ROUND') {
            startNextRoundCommand();
        } 

    }

    /*
        USE CASES
    */

    function setupCommand(player1, player2) { 
        setPlayers(player1, player2);
        resetGame();
        //start round
        startNextRound();
    }

    function moveCommand(playerIndex, cellIndex) {
        move(playerIndex, cellIndex);
            
        const winningCombination = searchWinningCombination(state.players[playerIndex].symbol);
        
        updateRoundStatus(winningCombination.length > 0);
        
        checkEndOfRound(winningCombination);
        switchPlayer();
    }

    function startNextRoundCommand() {
        if(state.currentRound.round == state.maxRounds - 1) return endGame();
        
        startNextRound();
    }



    
    function switchPlayer() {
        if(state.currentRound.statusRound !== RoundStatus.PLAYING) return;

        // switch player
        state.currentRound.currentPlayer = (state.currentRound.currentPlayer + 1) % state.players.length;

        //update screen board
        notifyAll({ id: 'UPDATE_BOARD', state});
    }



    // tested
    function setPlayers(player1, player2) {
        state.players[0].name = player1.name || 'player 1';
        state.players[0].type = player1.type || PlayerTypes.HUMAN;

        state.players[1].name = player2.name || 'player 2';
        state.players[1].type = player2.type || PlayerTypes.HUMAN;

        console.log('[game]', state.players);
    }

    // tested
    function resetGame() {
        state.statusGame = GameStatus.RUNNING;

        state.currentRound.round = -1;
        state.currentRound.currentPlayer = -1;
        state.currentRound.statusRound = null;

        state.scores = [];
    }
    
    // tested
    function endGame() {
        console.log('[game] End of game')
        state.statusGame = GameStatus.ENDED;

        notifyAll({
            id: 'END_GAME',
            state,
        });
    }

    // tested
    function startNextRound() {
        if(state.statusGame == GameStatus.ENDED) return;
        if(state.currentRound.round == state.maxRounds - 1) return;
        if(state.currentRound.statusRound == RoundStatus.PLAYING) return;

        state.board.cells = [
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        ];

        state.currentRound.round += 1;
        state.currentRound.currentPlayer = 0;
        state.currentRound.statusRound = RoundStatus.PLAYING;
        console.log('[game] startNextRound', state);

        notifyAll({
            id: 'START_ROUND',
            state,
        });
    }

    function debugBoard() {
        console.log('[game]');
        console.log(`${state.board.cells[0]} | ${state.board.cells[1]} | ${state.board.cells[2]}`);
        console.log(`${state.board.cells[3]} | ${state.board.cells[4]} | ${state.board.cells[5]}`);
        console.log(`${state.board.cells[6]} | ${state.board.cells[7]} | ${state.board.cells[8]}`);
    }

    // tested
    function move(playerIndex, cellIndex) {
        if(state.currentRound.statusRound !== RoundStatus.PLAYING) return;
        if(state.currentRound.currentPlayer !== playerIndex) return;
        if(state.board.cells[cellIndex] !== Symbols.EMPTY) return;

        console.log(`[game] move p${playerIndex} to cell ${cellIndex}`)
        state.board.cells[cellIndex] = state.players[playerIndex].symbol;
    }

    // tested
    function checkEndOfRound(winningCombination) {
        if(state.currentRound.statusRound === RoundStatus.PLAYING) return;

        console.log('[game] END OF ROUND!')
        //contabiliza scores
        if(state.currentRound.statusRound === RoundStatus.DRAW) {
            state.scores.push({ winner: 'Draw', combination: winningCombination})
        } else {
            state.scores.push({ winner: state.players[state.currentRound.currentPlayer].symbol, combination: winningCombination})
        }

        //update screen board
        notifyAll({ id: 'END_ROUND', state});
        
    }

    // tested (helper)
    function updateRoundStatus(hasWinningCombination) {
        if(hasWinningCombination === true) {
            // fim de jogo
            state.currentRound.statusRound = RoundStatus.WIN;
            console.log('[game]   > fim de jogo')
            return
        }
        
        // checa empate
        if(hasEmptyCells()) {
            // jogo não acabou
            state.currentRound.statusRound = RoundStatus.PLAYING;
            console.log('[game]   > jogo não acabou')
        } else {
            // empate
            state.currentRound.statusRound = RoundStatus.DRAW;
            console.log('[game]   > empate')
        }
        
    }

    // tested (helper)
    function searchWinningCombination(symbol) {
        let hasWinner = false;
        for(let i = 0; i < WINNING_COMBINATIONS.length && hasWinner == false; i++) {

           hasWinner = WINNING_COMBINATIONS[i].every(index => state.board.cells[index] == symbol);
    
           if(hasWinner == true) {
               return WINNING_COMBINATIONS[i];
           }
        }

        return [];
    }

    //tested (helper)
    function hasEmptyCells() {
        for(let i = 0; i < state.board.cells.length; i++) {
            if(state.board.cells[i] == Symbols.EMPTY) {
                return true;
            }
        }

        return false;
    }

    return {
        subscribe,
        notifyAll,
        observers,
        executeCommand,
        state,
        setupCommand,
        moveCommand,
        startNextRoundCommand,
        setPlayers,
        resetGame,
        endGame,
        startNextRound,
        checkEndOfRound,
        updateRoundStatus,
        switchPlayer,
        debugBoard,
        move,
        searchWinningCombination,
        hasEmptyCells,
    }

}
