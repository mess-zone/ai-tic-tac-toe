import { Symbols, PlayerTypes, RoundStatus } from "../createLogic.js";

export default function createViewController(window, nodes, observerController) {

    function createStartScreen() {
        nodes.startScreenEl = document.createElement('section');
        nodes.startScreenEl.id = 'start-screen';
        nodes.startScreenEl.classList.add('screen', 'screen--start');
        nodes.startScreenEl.innerHTML = `
        <form class="container">
            <h1>tic tac toe</h1>
    
            <div>
                <h2>player 1 (X)</h2>
                <label>name:
                    <input id="player1-name" type="text" placeholder="player 1" />
                </label>
                <label>
                    <input type="radio" name="player1-type"  value="HUMAN" checked> human
                </label>
                <label>
                    <input type="radio" name="player1-type"  value="COMPUTER" disabled> computer
                </label>
            </div>
            <div>
                <h2>player 2 (O)</h2>
                <label>name:
                    <input id="player2-name" type="text" placeholder="player 2" />
                </label>
                <label>
                    <input type="radio" name="player2-type"  value="HUMAN" checked> human
                </label>
                <label>
                    <input type="radio" name="player2-type"  value="COMPUTER" disabled> computer
                </label>
            </div>
    
            <button id="start-button">Start</button>
        </form>
        `;
        window.document.body.appendChild(nodes.startScreenEl);

        nodes.startScreenEl.querySelector('form').addEventListener('submit', configurePlayers);
    }

    function createRoundScreen() {
        nodes.roundScreenEl = document.createElement('section');
        nodes.roundScreenEl.id = 'round-screen';
        nodes.roundScreenEl.classList.add('screen', 'screen--round');
        nodes.roundScreenEl.innerHTML = `
        <div class="container">
            <h1>Round 0/0</h1>
        </div>
        `;
        window.document.body.appendChild(nodes.roundScreenEl);
        nodes.roundScreenEl.addEventListener("animationend", () => showBoardScreen() );

    }

    function createBoardScreen() {
        nodes.boardScreenEl = document.createElement('section');
        nodes.boardScreenEl.id = 'board-screen';
        nodes.boardScreenEl.classList.add('screen', 'screen--board');
        nodes.boardScreenEl.innerHTML = `
        <div class="container">
            <div class="hint" id="hint">
            </div>
            <div id="board-container">
                <div class="board" id="board">
                    <div class="board__cell" data-i="0"></div>
                    <div class="board__cell" data-i="1"></div>
                    <div class="board__cell" data-i="2"></div>
                    <div class="board__cell" data-i="3"></div>
                    <div class="board__cell" data-i="4"></div>
                    <div class="board__cell" data-i="5"></div>
                    <div class="board__cell" data-i="6"></div>
                    <div class="board__cell" data-i="7"></div>
                    <div class="board__cell" data-i="8"></div>
                </div>
            </div>
            <div class="score" id="score">
            </div>
        </div>
        `;
        window.document.body.appendChild(nodes.boardScreenEl);

        nodes.scoreEl = nodes.boardScreenEl.querySelector('#score');
        nodes.hintEl = nodes.boardScreenEl.querySelector('#hint');
        nodes.boardContainerEl = nodes.boardScreenEl.querySelector('#board-container');
        nodes.boardEl =  nodes.boardScreenEl.querySelector('#board');
        nodes.cellsEl =  nodes.boardEl.querySelectorAll('.board__cell');

        nodes.cellsEl.forEach(cellEl => {
            cellEl.addEventListener('click', handleCellClick);
        });

        window.addEventListener('resize', handleResize);

    }

    function createEndRoundScreen() {
        nodes.endRoundScreenEl = document.createElement('section');
        nodes.endRoundScreenEl.id = 'end-round-screen';
        nodes.endRoundScreenEl.classList.add('screen', 'screen--end-round');
        nodes.endRoundScreenEl.innerHTML = `
        <div class="container">
            <div id="nextRound">
                
                <h1 class="winnerMessage">player A won!</h1>
                <svg class="loading-icon" width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z" fill="#9911bb"/>
                    <path class="path" fill="transparent" stroke="black" stroke-width="50" fill-rule="evenodd" clip-rule="evenodd" d="M25 49C38.2548 49 49 38.2548 49 25C49 11.7452 38.2548 1 25 1C11.7452 1 1 11.7452 1 25C1 38.2548 11.7452 49 25 49ZM25 50C38.8071 50 50 38.8071 50 25C50 11.1929 38.8071 0 25 0C11.1929 0 0 11.1929 0 25C0 38.8071 11.1929 50 25 50Z" />
                </svg>
                <p>Next Round...</p>
                    
            </div> 
        </div>
        `;
        window.document.body.appendChild(nodes.endRoundScreenEl);

        nodes.endRoundScreenEl.addEventListener("animationend", startNextRound);

    }

    function createEndGameScreen() {
        nodes.endGameScreenEl = document.createElement('section');
        nodes.endGameScreenEl.id = 'end-game-screen';
        nodes.endGameScreenEl.classList.add('screen', 'screen--end-game');
        nodes.endGameScreenEl.innerHTML = `
        <div class="container">
            <h1>End of game!</h1>
            <div class="score"></div>
            <button class="restart">Restart</button>
        </div>
        `;
        window.document.body.appendChild(nodes.endGameScreenEl);

        nodes.endGameScoreEl = nodes.endGameScreenEl.querySelector('.score');
        nodes.endGameScreenEl.querySelector('.restart').addEventListener('click', () => showStartScreen() );
    }

    function createAllViews() {
        createStartScreen();
        createRoundScreen();
        createBoardScreen();
        createEndRoundScreen();
        createEndGameScreen();
    }


    function showStartScreen(model) {
        console.log('[screen] SHOW START SCREEN')
        nodes.endGameScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endRoundScreenEl.classList.remove('animating');
        
        nodes.startScreenEl.classList.add('screen--show');
    }

    function showRoundScreen(model) {
        resetBoard();

        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endGameScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.querySelector('h1').innerText = `Round ${model.currentRound}/${model.maxRounds}`;
        nodes.roundScreenEl.classList.add('screen--show');
        nodes.roundScreenEl.classList.add('animating');

        // setBoardInfo(model);
    }

    function setBoardInfo(model) {
        console.log('[screen] set board info', model);

        const updateScoreModel = {
            round: {
                currentRound: model.currentRound.round + 1,
                maxRounds: model.maxRounds,
            },
            X: {
                name: model.players[0].name,
                symbol: model.players[0].symbol,
                points: model.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 ),
            },
            O: {
                name: model.players[1].name,
                symbol: model.players[1].symbol,
                points: model.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 ),
            },
            draws: {
                name: 'Draws',
                symbol: '',
                points: model.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 ),
            },
        };

        updateScore(updateScoreModel);

        const drawBoardModel = {
            boardCells: model.board.cells,
            winnerCombination: model.scores[model.currentRound.round]?.combination,
        };
        drawBoard(drawBoardModel);

        const switchTurnModel = {
            isXTurn: model.players[model.currentRound.currentPlayer].symbol === Symbols.X,
            isOTurn: model.players[model.currentRound.currentPlayer].symbol === Symbols.O,
            isHumanTurn: model.players[model.currentRound.currentPlayer].type === PlayerTypes.HUMAN,
            hintText: model.currentRound.statusRound == RoundStatus.PLAYING ? `${model.players[model.currentRound.currentPlayer].name}: your turn!` : '',
        };
        switchTurn(switchTurnModel);
    }

    function showBoardScreen(model) {
        console.log('[screen] show board screen')
        nodes.startScreenEl.classList.remove('screen--show');
        nodes.boardScreenEl.classList.add('screen--show');
        handleResize();

        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endRoundScreenEl.classList.remove('animating');
    }

    function showEndRoundScreen(model) {
        console.log('[screen] showEndRound');
      
        nodes.endRoundScreenEl.querySelector('h1').innerText = model.text;
      
        nodes.endRoundScreenEl.classList.add('screen--show');
        nodes.endRoundScreenEl.classList.add('animating');

    }

    function showEndGameScreen(model) {
        nodes.endGameScoreEl.innerHTML = '';

        const roundCounterEl = document.createElement('h1');
        roundCounterEl.innerHTML = `Rounds: ${model.round.maxRounds}`;
        nodes.endGameScoreEl.appendChild(roundCounterEl);

        const xScoreEl = document.createElement('h1');
        xScoreEl.innerHTML = `${model.X.name} (${model.X.symbol}): ${model.X.points}`;
        nodes.endGameScoreEl.appendChild(xScoreEl);

        const oScoreEl = document.createElement('h1');
        oScoreEl.innerHTML = `${model.O.name} (${model.O.symbol}): ${model.O.points}`;
        nodes.endGameScoreEl.appendChild(oScoreEl);

        const drawScoreEl = document.createElement('h1');
        drawScoreEl.innerHTML = `${model.draws.name}: ${model.draws.points}`;
        nodes.endGameScoreEl.appendChild(drawScoreEl);

        nodes.endGameScreenEl.classList.add('screen--show');
        nodes.boardScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
    }


    // helpers

    function updateScore(model) {

        nodes.scoreEl.innerHTML = '';

        const roundCounterEl = document.createElement('h1');
        roundCounterEl.innerHTML = `Round: ${model.round.currentRound}/${model.round.maxRounds}`;
        nodes.scoreEl.appendChild(roundCounterEl);

        const xScoreEl = document.createElement('h1');
        xScoreEl.innerHTML = `${model.X.name} (${model.X.symbol}): ${model.X.points}`;
        nodes.scoreEl.appendChild(xScoreEl);

        const oScoreEl = document.createElement('h1');
        oScoreEl.innerHTML = `${model.O.name} (${model.O.symbol}): ${model.O.points}`;
        nodes.scoreEl.appendChild(oScoreEl);

        const drawScoreEl = document.createElement('h1');
        drawScoreEl.innerHTML = `${model.draws.name}: ${model.draws.points}`;
        nodes.scoreEl.appendChild(drawScoreEl);
    }

    function resetBoard() {
        console.log('[screen] resetBoard');

        for(let i = 0; i < nodes.cellsEl.length; i++) {
            nodes.cellsEl[i].classList.add('board__cell--empty');
            nodes.cellsEl[i].classList.remove('board__cell--X');
            nodes.cellsEl[i].classList.remove('board__cell--O');
            nodes.cellsEl[i].classList.remove('board__cell--highlight');
        }
    }

    function drawBoard(model) {
        resetBoard();

        console.log('[screen] drawBoard');

        for(let i = 0; i < model.boardCells.length; i++) {
            if(model.boardCells[i] == Symbols.EMPTY) {
                nodes.cellsEl[i].classList.add('board__cell--empty');
            } else {
                nodes.cellsEl[i].classList.remove('board__cell--empty');
                nodes.cellsEl[i].classList.add(`board__cell--${model.boardCells[i]}`);
            }   
            
            // nodes.cellsEl[i].classList.remove('board__cell--highlight');
        }

        if(model.winnerCombination) {
            model.winnerCombination.forEach(cellIndex => {
                nodes.cellsEl[cellIndex].classList.add('board__cell--highlight');
            });
            // console.log('[screen] winning combination', model.winnerCombination)
        }
    }
    
    function switchTurn(model) {
        console.log('[screen] switchTurn ');

        nodes.boardEl.classList.toggle('turn--X', model.isXTurn);
        nodes.boardEl.classList.toggle('turn--O', model.isOTurn);

        nodes.hintEl.innerHTML = model.hintText;

        nodes.boardEl.classList.toggle('board--human-turn', model.isHumanTurn);
        
        // if(model.isRoundEnded) {
        //     nodes.boardEl.classList.remove('board--human-turn');
        // }
    }

    function handleResize(e) {
        const side = nodes.boardContainerEl.offsetWidth <= nodes.boardContainerEl.offsetHeight ? nodes.boardContainerEl.offsetWidth : nodes.boardContainerEl.offsetHeight;

        nodes.boardEl.style.width = side + 'px';
        nodes.boardEl.style.height = side + 'px';
    }

    function move(playerIndex, cellIndex) {
        console.log('[screen] move');

        observerController.notifyAll({ 
            id: 'MOVE', 
            playerIndex,
            cellIndex,
        });
    }

    function handleCellClick(e) {
        // TODO refactor use data-current-player
        const currentPlayerIndex = nodes.boardEl.classList.contains('turn--X') ? 0 : 1;
        const cellIndex = e.target.dataset?.i;

        move(currentPlayerIndex, cellIndex);
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

        observerController.notifyAll({ 
            id: 'SETUP', 
            player1, 
            player2,
        });
    }

    function startNextRound() {
        console.log('[screen] start next round')
        observerController.notifyAll({
            id: 'START_NEXT_ROUND'
        });
    }

    return {
        nodes,
        window,

        createStartScreen,
        createRoundScreen,
        createBoardScreen,
        createEndRoundScreen,
        createEndGameScreen,
        createAllViews,

        showStartScreen,
        showRoundScreen,
        showBoardScreen,
        showEndRoundScreen,
        showEndGameScreen,

        resetBoard,
        setBoardInfo,
        updateScore,
        drawBoard,
        switchTurn,
        move,

        handleResize,
        handleCellClick,
        configurePlayers,
        startNextRound,
    }
}