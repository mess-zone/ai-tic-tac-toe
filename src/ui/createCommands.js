import { Symbols, PlayerTypes, RoundStatus } from "../createLogic.js";

export default function createCommands(viewsController) {
    let state = {};

    function SETUP(command) {
        console.log('[ui] SETUP');
        viewsController.showStartScreen();
    }
    
    function START_ROUND(command) {
        console.log('[ui] START_ROUND');
        state = {...command.state};
        // const modelRoundScreen = {
        //     currentRound: state.currentRound.round + 1,
        //     maxRounds: state.maxRounds,
        // };
        viewsController.showRoundScreen(state);
    }

    function UPDATE_BOARD(command) {
        console.log('[iu] UPDATE BOARD');
        state = {...command.state};

        const updateScoreModel = {
            round: {
                currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            },
            X: {
                name: state.players[0].name,
                symbol: state.players[0].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 ),
            },
            O: {
                name: state.players[1].name,
                symbol: state.players[1].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 ),
            },
            draws: {
                name: 'Draws',
                symbol: '',
                points: state.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 ),
            },
        };

        viewsController.updateScore(updateScoreModel);

        const drawBoardModel = {
            boardCells: state.board.cells,
            winnerCombination: state.scores[state.currentRound.round]?.combination,
        };
        viewsController.drawBoard(drawBoardModel);

        const switchTurnModel = {
            isXTurn: state.players[state.currentRound.currentPlayer].symbol === Symbols.X,
            isOTurn: state.players[state.currentRound.currentPlayer].symbol === Symbols.O,
            isHumanTurn: state.players[state.currentRound.currentPlayer].type === PlayerTypes.HUMAN,
            hintText: state.currentRound.statusRound == RoundStatus.PLAYING ? `${state.players[state.currentRound.currentPlayer].name}: your turn!` : '',
        };
        viewsController.switchTurn(switchTurnModel);
    }

    function END_ROUND(command) {
        console.log('[ui] END ROUND');
        state = {...command.state};

        const updateScoreModel = {
            round: {
                currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            },
            X: {
                name: state.players[0].name,
                symbol: state.players[0].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 ),
            },
            O: {
                name: state.players[1].name,
                symbol: state.players[1].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 ),
            },
            draws: {
                name: 'Draws',
                symbol: '',
                points: state.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 ),
            },
        };

        viewsController.updateScore(updateScoreModel);

        const drawBoardModel = {
            boardCells: state.board.cells,
            winnerCombination: state.scores[state.currentRound.round]?.combination,
        };
        viewsController.drawBoard(drawBoardModel);

        const switchTurnModel = {
            isXTurn: state.players[state.currentRound.currentPlayer].symbol === Symbols.X,
            isOTurn: state.players[state.currentRound.currentPlayer].symbol === Symbols.O,
            isHumanTurn: state.players[state.currentRound.currentPlayer].type === PlayerTypes.HUMAN,
            hintText: state.currentRound.statusRound == RoundStatus.PLAYING ? `${state.players[state.currentRound.currentPlayer].name}: your turn!` : '',
        };
        viewsController.switchTurn(switchTurnModel);

        const endRoundScreenModel = {
            text: state.currentRound.statusRound == RoundStatus.WIN ? `${state.players[state.currentRound.currentPlayer].name} won!` : 'Draw!',
        };
        viewsController.showEndRoundScreen(endRoundScreenModel);
    }

    function END_GAME(command) {
        console.log('[ui] END GAME');
        state = {...command.state};

        const endGameModel = {
            round: {
                // currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            },
            X: {
                name: state.players[0].name,
                symbol: state.players[0].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 ),
            },
            O: {
                name: state.players[1].name,
                symbol: state.players[1].symbol,
                points: state.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 ),
            },
            draws: {
                name: 'Draws',
                symbol: '',
                points: state.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 ),
            },
        };
        viewsController.showEndGameScreen(endGameModel);
    }

    return {
        SETUP,
        START_ROUND,
        UPDATE_BOARD,
        END_ROUND,
        END_GAME,
    }
}