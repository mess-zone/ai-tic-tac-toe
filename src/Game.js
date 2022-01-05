
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

export default class Game {
    constructor() {

        this.state = {
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
                {
                    winner: null,
                },
                {
                    winner: null,
                },
                {
                    winner: null,
                },
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
        }
    }

    setup(player1, player2) {
        this.state.players[0].name = player1.name;
        this.state.players[0].type = player1.type;

        this.state.players[1].name = player2.name;
        this.state.players[1].type = player2.type;

        console.log(this.state.players);
    }

    startGame() {
        this.state.statusGame = GameStatus.RUNNING;

        //start round
        this.startNextRound();
    }

    startNextRound() {
        this.state.board.cells = [
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
            Symbols.EMPTY, Symbols.EMPTY, Symbols.EMPTY, 
        ];

        this.state.currentRound.round += 1;
        this.state.currentRound.currentPlayer = 0;
        this.state.currentRound.statusRound = RoundStatus.PLAYING;
        console.log('startNextRound', this.state.currentRound);
    }

    debugBoard() {
        console.log(`${this.state.board.cells[0]} | ${this.state.board.cells[1]} | ${this.state.board.cells[2]}`);
        console.log(`${this.state.board.cells[3]} | ${this.state.board.cells[4]} | ${this.state.board.cells[5]}`);
        console.log(`${this.state.board.cells[6]} | ${this.state.board.cells[7]} | ${this.state.board.cells[8]}`);
    }

    move(playerIndex, cellIndex) {
        if(this.state.currentRound.statusRound === RoundStatus.PLAYING) {
            if(this.state.currentRound.currentPlayer == playerIndex) {
                if(this.state.board.cells[cellIndex] == Symbols.EMPTY) {
                    console.log(`move p${playerIndex} to cell ${cellIndex}`)
                    this.state.board.cells[cellIndex] = this.state.players[playerIndex].symbol;
    
                    // check end of round
                    this.checkEndOfRound(this.state.players[playerIndex].symbol);
    
                    if(this.state.currentRound.statusRound === RoundStatus.PLAYING) {
                        // switch player
                        this.state.currentRound.currentPlayer = (this.state.currentRound.currentPlayer + 1) % 2;
                    } else {
                        console.log('END OF ROUND!')
                    }
                }
            }
        }
    }


    searchWinningCombination(symbol) {
        let hasWinner = false;
        for(let i = 0; i < WINNING_COMBINATIONS.length && hasWinner == false; i++) {

           hasWinner = WINNING_COMBINATIONS[i].every(index => this.state.board.cells[index] == symbol);
    
           if(hasWinner == true) {
               return WINNING_COMBINATIONS[i];
           }
        }

        return [];
    }

    checkEndOfRound(symbol) {
        // console.log('check end of round for', symbol)
        const winningCombination = this.searchWinningCombination(symbol);
        // console.log(winningCombination)

        // nenhuma combinação encontrada
        if(winningCombination.length == 0) {
            // console.log('  > nenhuma combinação encontrada')
            
            // checa empate
            console.log('empty cells', this.hasEmptyCells())
            if(this.hasEmptyCells() == false) {
                this.state.currentRound.statusRound = RoundStatus.DRAW;
                console.log('  > empate')
                return;
                // return RoundStatus.DRAW;
            }
            // jogo não acabou
            this.state.currentRound.statusRound = RoundStatus.PLAYING;
            console.log('  > jogo não acabou')
            // return RoundStatus.PLAYING;
        } else {
            // fim de jogo
            this.state.currentRound.statusRound = RoundStatus.WIN;
            console.log('  > fim de jogo')
            // return RoundStatus.WIN;
        }
    }

    hasEmptyCells() {
        for(let i = 0; i < this.state.board.cells.length; i++) {
            if(this.state.board.cells[i] == Symbols.EMPTY) {
                return true;
            }
        }

        return false;
    }

}