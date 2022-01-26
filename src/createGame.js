
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

export function createState(){
    return {
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

};

export function createCommands(logic, observerController) {

    function SETUP({ player1, player2 }) { 
        logic.setPlayers(player1, player2);
        logic.resetGame();
        
        const shouldStartNextRound = logic.startNextRound();

        if(shouldStartNextRound) {
            observerController.notifyAll({
                id: 'START_ROUND',
                state: logic.state,
            });
        }
    }

    function MOVE({ playerIndex, cellIndex }) {
        logic.move(playerIndex, cellIndex);
        
        const isEndOfRound = logic.checkEndOfRound();
        
        if(isEndOfRound) {
            //update screen board
            observerController.notifyAll({ 
                id: 'END_ROUND', 
                state: logic.state
            });
        }

        const isSwitch = logic.switchPlayer();
        if(isSwitch) {
            //update screen board
            observerController.notifyAll({ 
                id: 'UPDATE_BOARD', 
                state:logic.state
            });
        }

    }

    function START_NEXT_ROUND(command) {
        const isEndOfGame = logic.checkEndOfGame();
        if(isEndOfGame) {
            observerController.notifyAll({
                id: 'END_GAME',
                state: logic.state,
            });
            return;
        }
            
        const shouldStartNextRound = logic.startNextRound();

        if(shouldStartNextRound) {
            observerController.notifyAll({
                id: 'START_ROUND',
                state: logic.state,
            });
        }
    }

    return {
        SETUP,
        MOVE,
        START_NEXT_ROUND,
    }
}

export function createObserverController() {
    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    return {
        observers,
        subscribe,
        notifyAll
    }
}

export default function createGameController(commands) {

    // const observers = [];

    // function subscribe(observerFunction) {
    //     observers.push(observerFunction)
    // }

    // function notifyAll(command) {
    //     for (const observerFunction of observers) {
    //         observerFunction(command)
    //     }
    // }

    function executeCommand(command) {
        console.log('[game] executeCommand ', command);

        const commandId = command.id;

        commands[commandId](command);
    }

    return {
        // subscribe,
        // notifyAll,
        // observers,
        executeCommand,
        commands,
    }

}

export function createLogic(initialState) {
    const state = initialState;
    
    function switchPlayer() {
        if(state.currentRound.statusRound !== RoundStatus.PLAYING) return false;

        // switch player
        state.currentRound.currentPlayer = (state.currentRound.currentPlayer + 1) % state.players.length;

        return true;
    }

    function setPlayers(player1, player2) {
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
        const hasEmptyCell = hasEmptyCells(state.board.cells);

        if(!combination && hasEmptyCell) {
            // round não acabou
            state.currentRound.statusRound = RoundStatus.PLAYING;
            return false;
        }

        // fim de round
        state.currentRound.statusRound = combination ? RoundStatus.WIN : RoundStatus.DRAW;
        console.log(`[game] Status round: ${state.currentRound.statusRound}`);

        //contabiliza scores
        const winner = combination ? state.players[state.currentRound.currentPlayer].symbol : 'Draw';
        state.scores.push({ 
            winner, 
            combination: combination || [] 
        });

        return true;
    }

    // helper
    function searchWinningCombination(symbol, boardCells) {
        return WINNING_COMBINATIONS.find((combination) => 
            combination.every(index => boardCells[index] === symbol)
        );
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
        state,
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

