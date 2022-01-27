import { Symbols, PlayerTypes, RoundStatus } from "../createLogic.js";

export default function createScreen(viewsController, observerController) {

    let state = {};

    function init() {

        viewsController.createAllViews();

        console.log('[screen] init')
        viewsController.nodes.startScreenEl = viewsController.window.document.getElementById('start-screen');
        viewsController.nodes.roundScreenEl = viewsController.window.document.getElementById('round-screen');
        viewsController.nodes.endRoundScreenEl = viewsController.window.document.getElementById('end-round-screen');
        viewsController.nodes.endGameScreenEl = viewsController.window.document.getElementById('end-game-screen');
        
        viewsController.nodes.endGameScoreEl = viewsController.nodes.endGameScreenEl.querySelector('.score');

        viewsController.nodes.boardScreenEl = viewsController.window.document.getElementById('board-screen');
        viewsController.nodes.scoreEl =  viewsController.nodes.boardScreenEl.querySelector('#score');
        viewsController.nodes.hintEl =  viewsController.nodes.boardScreenEl.querySelector('#hint');
        viewsController.nodes.boardContainerEl =  viewsController.nodes.boardScreenEl.querySelector('#board-container');
        viewsController.nodes.boardEl =  viewsController.nodes.boardScreenEl.querySelector('#board');
        viewsController.nodes.cellsEl =  viewsController.nodes.boardEl.querySelectorAll('.board__cell');

        viewsController.nodes.cellsEl.forEach(cellEl => {
            cellEl.addEventListener('click', handleCellClick);
        });
        

        viewsController.window.addEventListener('resize', viewsController.handleResize);

        viewsController.nodes.startScreenEl.querySelector('form').addEventListener('submit', configurePlayers);

        viewsController.nodes.roundScreenEl.addEventListener("animationend", () => viewsController.showBoardScreen(state) );

        viewsController.nodes.endRoundScreenEl.addEventListener("animationend", startNextRound);

        viewsController.nodes.endGameScreenEl.querySelector('.restart').addEventListener('click', () => viewsController.showStartScreen(state) );

    }



    function handleCellClick(e) {
        console.log('[screen] cell clicked', e.target.dataset?.i, state);

        observerController.notifyAll({ 
            id: 'MOVE', 
            playerIndex: state.currentRound.currentPlayer, 
            cellIndex: e.target.dataset?.i 
        });

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
            name: viewsController.nodes.startScreenEl.querySelector('#player1-name').value || 'player 1',
            type: viewsController.nodes.startScreenEl.querySelector('input[name="player1-type"]:checked')?.value || 'HUMAN',
        };

        const player2 = {
            name: viewsController.nodes.startScreenEl.querySelector('#player2-name').value || 'player 2',
            type: viewsController.nodes.startScreenEl.querySelector('input[name="player2-type"]:checked')?.value || 'HUMAN',
        };

        console.log('[screen] configure players', player1, player2);

        observerController.notifyAll({ 
            id: 'SETUP', 
            player1, 
            player2,
        });
    }

    // ?
    function startNextRound() {
        console.log('[screen] start next round', state)
        observerController.notifyAll({
            id: 'START_NEXT_ROUND'
        });
    }


    return {
        executeCommand,
        state,

        init,

        startNextRound,
    }
}
