
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
        console.log('Game');

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
                currentPlayer: 0,
                // roundWinner: null,
                statusRound: RoundStatus.PLAYING,
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
                    type: PlayerTypes.HUMAN,
                    symbol: Symbols.X,
                },
                { 
                    type: PlayerTypes.HUMAN,
                    symbol: Symbols.O,
                }
            ],
        }
    }
}