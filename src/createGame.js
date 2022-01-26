
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

        const commandId = command.id;

        commands[commandId](command);
    }

    const commands = {
        SETUP: ({ player1, player2 }) => { 
            setPlayers(player1, player2);
            resetGame();
            
            const shouldStartNextRound = startNextRound();
    
            if(shouldStartNextRound) {
                notifyAll({
                    id: 'START_ROUND',
                    state,
                });
            }
        },

        MOVE: ({ playerIndex, cellIndex }) => {
            move(playerIndex, cellIndex);
            
            const isEndOfRound = checkEndOfRound();
            
            if(isEndOfRound) {
                //update screen board
                notifyAll({ id: 'END_ROUND', state});
            }
    
            const isPlayerSwitched = switchPlayer();
            if(isPlayerSwitched) {
                //update screen board
                notifyAll({ id: 'UPDATE_BOARD', state});
            }
    
        },

        START_NEXT_ROUND: (command) => {
            const isEndOfGame = checkEndOfGame();
            if(isEndOfGame) {
                notifyAll({
                    id: 'END_GAME',
                    state,
                });
                return;
            }
            
    
            const shouldStartNextRound = startNextRound();
    
            if(shouldStartNextRound) {
                notifyAll({
                    id: 'START_ROUND',
                    state,
                });
            }
        },
    }




    function switchPlayer() {
        if(state.currentRound.statusRound !== RoundStatus.PLAYING) return false;

        // switch player
        state.currentRound.currentPlayer = (state.currentRound.currentPlayer + 1) % state.players.length;

        return true;
    }

    function setPlayers(player1, player2) {
        console.log('HHHHERRE ', player1, player2)
        state.players[0].name = player1.name || 'player 1';
        state.players[0].type = player1.type || PlayerTypes.HUMAN;

        state.players[1].name = player2.name || 'player 2';
        state.players[1].type = player2.type || PlayerTypes.HUMAN;

        console.log('[game]', state.players);
    }

    function resetGame() {
        state.statusGame = GameStatus.RUNNING;

        state.currentRound.round = -1;
        state.currentRound.currentPlayer = -1;
        state.currentRound.statusRound = null;

        state.scores = [];
    }
    
    function checkEndOfGame() {
        if(state.currentRound.round < state.maxRounds - 1) return false;

        console.log('[game] End of game')
        state.statusGame = GameStatus.ENDED;
        return true;
    }

    function startNextRound() {
        if(state.statusGame === GameStatus.ENDED) return false;
        if(state.currentRound.round === state.maxRounds - 1) return false;
        if(state.currentRound.statusRound === RoundStatus.PLAYING) return false;

        state.board.cells = [
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        ];

        state.currentRound.round += 1;
        state.currentRound.currentPlayer = 0;
        state.currentRound.statusRound = RoundStatus.PLAYING;
        console.log('[game] startNextRound', state);

        return true;
    }

    function move(playerIndex, cellIndex) {
        if(state.currentRound.statusRound !== RoundStatus.PLAYING) return;
        if(state.currentRound.currentPlayer !== playerIndex) return;
        if(state.board.cells[cellIndex] !== Symbols.EMPTY) return;

        console.log(`[game] move p${playerIndex} to cell ${cellIndex}`)
        state.board.cells[cellIndex] = state.players[playerIndex].symbol;
    }

    
    function checkEndOfRound() {
        const combination = searchWinningCombination(state.players[state.currentRound.currentPlayer].symbol, state.board.cells);
        const hasWinningCombination = combination.length > 0;
        const hasEmpty = hasEmptyCells(state.board.cells);

        if(!hasWinningCombination && hasEmpty) {
            // round não acabou
            state.currentRound.statusRound = RoundStatus.PLAYING;
            return false;
        }

        // fim de round
        state.currentRound.statusRound = hasWinningCombination ? RoundStatus.WIN : RoundStatus.DRAW;
        console.log(`[game] Status round: ${state.currentRound.statusRound}`);

        //contabiliza scores
        const winner = hasWinningCombination ? state.players[state.currentRound.currentPlayer].symbol : 'Draw';
        state.scores.push({ winner, combination });

        return true;
    }

    // helper
    function searchWinningCombination(symbol, boardCells) {
        let hasWinner = false;

        for(let i = 0; i < WINNING_COMBINATIONS.length && hasWinner === false; i++) {

           hasWinner = WINNING_COMBINATIONS[i].every(index => boardCells[index] === symbol);
    
           if(hasWinner) {
               return WINNING_COMBINATIONS[i];
           }
        }

        return [];
    }

    // helper
    function hasEmptyCells(boardCells) {
        return boardCells.some(cell => cell === Symbols.EMPTY);
    }

    // helper
    function debugBoard(boardCells) {
        console.log('[game]');
        console.log(`${boardCells[0]} | ${boardCells[1]} | ${boardCells[2]}`);
        console.log(`${boardCells[3]} | ${boardCells[4]} | ${boardCells[5]}`);
        console.log(`${boardCells[6]} | ${boardCells[7]} | ${boardCells[8]}`);
    }

    return {
        subscribe,
        notifyAll,
        observers,
        executeCommand,
        state,
        commands,


        setPlayers,
        resetGame,
        checkEndOfGame,
        startNextRound,
        checkEndOfRound,
        switchPlayer,
        move,

        //helper functions
        searchWinningCombination,
        hasEmptyCells,
        debugBoard,
    }

}
