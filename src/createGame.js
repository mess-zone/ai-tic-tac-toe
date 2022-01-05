

function createGame() {

        const GameStatus = {
            SETUP: 'SETUP',
            RUNNING: 'RUNNING',
            ENDED: 'ENDED',
        }

        const RoundStatus = {
            PLAYING: 'PLAYING',
            DRAW: 'DRAW',
            WIN: 'WIN',
        }

        const PlayerTypes = {
            HUMAN: 'HUMAN',
            COMPUTER: 'COMPUTER',
        }

        const Symbols = {
            X: 'X',
            O: 'O',
            EMPTY: '',
        }

        const WINNING_COMBINATIONS = [
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
            //     winner: null,
            // },
            // {
            //     winner: null,
            // },
            // {
            //     winner: null,
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
    

    function setup(player1, player2) {
        state.players[0].name = player1.name;
        state.players[0].type = player1.type;

        state.players[1].name = player2.name;
        state.players[1].type = player2.type;

        console.log(state.players);
    }

    function startGame() {
        state.statusGame = GameStatus.RUNNING;

        state.currentRound.round = -1;
        state.currentRound.currentPlayer = -1;
        state.currentRound.statusRound = null;

        state.scores = [];
        
        //start round
        startNextRound();
    }
    
    function endGame() {
        console.log('End of game')
        state.statusGame = GameStatus.ENDED;
    }

    function startNextRound() {
        if(state.statusGame == GameStatus.ENDED) return;
        if(state.currentRound.round == state.maxRounds - 1) return;

        state.board.cells = [
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        ];

        state.currentRound.round += 1;
        state.currentRound.currentPlayer = 0;
        state.currentRound.statusRound = RoundStatus.PLAYING;
        console.log('startNextRound', state.currentRound);
    }

    function debugBoard() {
        console.log(`${state.board.cells[0]} | ${state.board.cells[1]} | ${state.board.cells[2]}`);
        console.log(`${state.board.cells[3]} | ${state.board.cells[4]} | ${state.board.cells[5]}`);
        console.log(`${state.board.cells[6]} | ${state.board.cells[7]} | ${state.board.cells[8]}`);
    }

    function move(playerIndex, cellIndex) {
        if(state.currentRound.statusRound === RoundStatus.PLAYING) {
            if(state.currentRound.currentPlayer == playerIndex) {
                if(state.board.cells[cellIndex] == Symbols.EMPTY) {
                    console.log(`move p${playerIndex} to cell ${cellIndex}`)
                    state.board.cells[cellIndex] = state.players[playerIndex].symbol;
    
                    // check end of round
                    checkEndOfRound(state.players[playerIndex].symbol);
    
                    if(state.currentRound.statusRound === RoundStatus.PLAYING) {
                        // switch player
                        state.currentRound.currentPlayer = (state.currentRound.currentPlayer + 1) % 2;
                    } else {
                        console.log('END OF ROUND!')
                        //contabiliza scores
                        if(state.currentRound.statusRound === RoundStatus.DRAW) {
                            state.scores.push({ winner: 'Draw'})
                        } else {
                            state.scores.push({ winner: state.players[playerIndex].symbol})
                        }

                        if(state.currentRound.round == state.maxRounds - 1) {
                            //end of game
                            endGame();
                        }
                    }
                }
            }
        }
    }


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

    function checkEndOfRound(symbol) {
        // console.log('check end of round for', symbol)
        const winningCombination = searchWinningCombination(symbol);
        // console.log(winningCombination)

        // nenhuma combinação encontrada
        if(winningCombination.length == 0) {
            // console.log('  > nenhuma combinação encontrada')
            
            // checa empate
            console.log('empty cells', hasEmptyCells())
            if(hasEmptyCells() == false) {
                state.currentRound.statusRound = RoundStatus.DRAW;
                console.log('  > empate')
                return;
                // return RoundStatus.DRAW;
            }
            // jogo não acabou
            state.currentRound.statusRound = RoundStatus.PLAYING;
            console.log('  > jogo não acabou')
            // return RoundStatus.PLAYING;
        } else {
            // fim de jogo
            state.currentRound.statusRound = RoundStatus.WIN;
            console.log('  > fim de jogo')
            // return RoundStatus.WIN;
        }
    }

    function hasEmptyCells() {
        for(let i = 0; i < state.board.cells.length; i++) {
            if(state.board.cells[i] == Symbols.EMPTY) {
                return true;
            }
        }

        return false;
    }

    return {
        state,
        setup,
        startGame,
        endGame,
        startNextRound,
        debugBoard,
        move,
        searchWinningCombination,
        checkEndOfRound,
        hasEmptyCells,
    }

}

export default createGame;