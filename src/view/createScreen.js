import { Symbols, PlayerTypes, RoundStatus } from "../createLogic.js";
import createViewController from "./createViewController.js";

export default function createScreen(window) {
    const nodes = {};
    let viewsController;

    let state = {};

    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }


    function init() {
        viewsController = createViewController(window, nodes);

        viewsController.createViews();

        console.log('[screen] init')
        nodes.startScreenEl = window.document.getElementById('start-screen');
        nodes.roundScreenEl = window.document.getElementById('round-screen');
        nodes.endRoundScreenEl = window.document.getElementById('end-round-screen');
        nodes.endGameScreenEl = window.document.getElementById('end-game-screen');
        
        nodes.endGameScoreEl = nodes.endGameScreenEl.querySelector('.score');

        nodes.boardScreenEl = window.document.getElementById('board-screen');
        nodes.scoreEl =  nodes.boardScreenEl.querySelector('#score');
        nodes.hintEl =  nodes.boardScreenEl.querySelector('#hint');
        nodes.boardContainerEl =  nodes.boardScreenEl.querySelector('#board-container');
        nodes.boardEl =  nodes.boardScreenEl.querySelector('#board');
        nodes.cellsEl =  nodes.boardEl.querySelectorAll('.board__cell');

        nodes.cellsEl.forEach(cellEl => {
            cellEl.addEventListener('click', handleCellClick);
        });
        

        window.addEventListener('resize', viewsController.handleResize);

        nodes.startScreenEl.querySelector('form').addEventListener('submit', configurePlayers);

        nodes.roundScreenEl.addEventListener("animationend", () => viewsController.showBoardScreen(state) );

        nodes.endRoundScreenEl.addEventListener("animationend", startNextRound);

        nodes.endGameScreenEl.querySelector('.restart').addEventListener('click', () => viewsController.showStartScreen(state) );

    }



    function handleCellClick(e) {
        console.log('[screen] cell clicked', e.target.dataset?.i, state);

        //notifica game
        notifyAll({ id: 'MOVE', playerIndex: state.currentRound.currentPlayer, cellIndex: e.target.dataset?.i });

    }

    function executeCommand(command) {
        console.log('[screen] executeCommand ', command);

        if(command.id == 'SETUP') {
            viewsController.showStartScreen();
        } else if(command.id == 'START_ROUND') {
            state = {...command.state};
            console.log('[screen] starting round', state)
            const modelRoundScreen = {
                currentRound: state.currentRound.round + 1,
                maxRounds: state.maxRounds,
            };
            viewsController.showRoundScreen(modelRoundScreen);
        } else if(command.id == 'UPDATE_BOARD') {
            state = {...command.state};
            console.log('[screen] UPDATE BOARD', state)

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
        } else if(command.id == 'END_ROUND') {
            state = {...command.state};
            console.log('[screen] END ROUND', state)

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
        } else if(command.id == 'END_GAME') {
            state = {...command.state};
            console.log('[screen] END GAME', state);

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
        
        console.log('[screen] current state', state)
        console.log('[screen] current state.board', state.board)
    }



    function configurePlayers(e) {
        e.preventDefault();
        const player1 = {
            name: nodes.startScreenEl.querySelector('#player1-name').value || 'player 1',
            type: nodes.startScreenEl.querySelector('input[name="player1-type"]:checked')?.value || 'HUMAN',
        };

        const player2 = {
            name: nodes.startScreenEl.querySelector('#player2-name').value || 'player 2',
            type: nodes.startScreenEl.querySelector('input[name="player2-type"]:checked')?.value || 'HUMAN',
        };

        console.log('[screen] configure players', player1, player2);

        notifyAll({ id: 'SETUP', player1, player2 });
    }

    // ?
    function startNextRound() {
        console.log('[screen] start next round', state)
        notifyAll({id: 'START_NEXT_ROUND'});
    }


    return {
        subscribe,
        notifyAll,
        observers,
        executeCommand,
        nodes,
        state,

        init,

        startNextRound,
    }
}
