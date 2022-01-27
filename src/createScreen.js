import { Symbols, PlayerTypes, RoundStatus } from "./createLogic.js";

export default function createScreen(window) {
    const nodes = {};

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

    function createViews() {
        // start-screen
        window.document.body.innerHTML += `
        <section id="start-screen" class="screen screen--start">
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
        </section>
        `;

        // round-screen
        window.document.body.innerHTML += `
        <div id="round-screen" class="screen screen--round">
            <div class="container">
                <h1>Round 0/0</h1>
            </div>
        </div>
        `;

        // board-screen
        window.document.body.innerHTML += `
        <section id="board-screen" class="screen screen--board">
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
        </section>
        `;

        // end-round-screen
        window.document.body.innerHTML += `
        <section id="end-round-screen" class="screen screen--end-round">
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
        </section>
        `;

        //end-game-screen
        window.document.body.innerHTML += `
        <section id="end-game-screen" class="screen screen--end-game">
            <div class="container">
                <h1>End of game!</h1>
                <div class="score"></div>
                <button class="restart">Restart</button>
            </div>
        </section>
        `;
    }

    function init() {

        createViews();

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
        

        window.addEventListener('resize', handleResize);

        nodes.startScreenEl.querySelector('form').addEventListener('submit', configurePlayers);

        nodes.roundScreenEl.addEventListener("animationend", showBoardScreen);

        nodes.endRoundScreenEl.addEventListener("animationend", startNextRound);

        nodes.endGameScreenEl.querySelector('.restart').addEventListener('click', showStartScreen);

    }

    function handleResize(e) {
        const side = nodes.boardContainerEl.offsetWidth <= nodes.boardContainerEl.offsetHeight ? nodes.boardContainerEl.offsetWidth : nodes.boardContainerEl.offsetHeight;

        nodes.boardEl.style.width = side + 'px';
        nodes.boardEl.style.height = side + 'px';
    }

    function handleCellClick(e) {
        console.log('[screen] cell clicked', e.target.dataset?.i, state);

        //notifica game
        notifyAll({ id: 'MOVE', playerIndex: state.currentRound.currentPlayer, cellIndex: e.target.dataset?.i });

    }

    function executeCommand(command) {
        console.log('[screen] executeCommand ', command);

        if(command.id == 'SETUP') {
            showStartScreen();
        } else if(command.id == 'START_ROUND') {
            state = {...command.state};
            console.log('[screen] starting round', state)
            showRoundScreen();
        } else if(command.id == 'UPDATE_BOARD') {
            state = {...command.state};
            console.log('[screen] UPDATE BOARD', state)
            updateScore();
            drawBoard();
            switchTurn();
        } else if(command.id == 'END_ROUND') {
            state = {...command.state};
            console.log('[screen] END ROUND', state)
            updateScore();
            drawBoard();
            switchTurn();
            showEndRoundScreen();
        } else if(command.id == 'END_GAME') {
            state = {...command.state};
            console.log('[screen] END GAME', state)
            showEndGameScreen();
        }
        
        console.log('[screen] current state', state)
        console.log('[screen] current state.board', state.board)
    }

    function showStartScreen() {
        console.log('[screen] SHOW START SCREEN')
        nodes.endGameScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endRoundScreenEl.classList.remove('animating');
        
        nodes.startScreenEl.classList.add('screen--show');
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

    function showRoundScreen() {

        resetBoard();

        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endGameScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.querySelector('h1').innerText = `Round ${state.currentRound.round + 1}/${state.maxRounds}`;
        nodes.roundScreenEl.classList.add('screen--show');
        nodes.roundScreenEl.classList.add('animating');
    }

    function showBoardScreen() {
        console.log('[screen] show board screen')
        nodes.startScreenEl.classList.remove('screen--show');
        nodes.boardScreenEl.classList.add('screen--show');
        handleResize();
        updateScore();
        drawBoard();
        switchTurn();
        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endRoundScreenEl.classList.remove('animating');
    }

    function switchTurn() {
        console.log('[screen] switchTurn ', state.currentRound)
        const previousPlayerIndex = Math.abs((state.currentRound.currentPlayer - 1) % state.players.length);
        // console.log('[screen] previous player', previousPlayerIndex, state.players[previousPlayerIndex]?.symbol)
        nodes.boardEl.classList.remove('turn--' + state.players[previousPlayerIndex]?.symbol);
        // state.currentRound.currentPlayer = (state.currentRound.currentPlayer + 1) % state.players.length;
        nodes.boardEl.classList.add('turn--' + state.players[state.currentRound.currentPlayer].symbol);

        if(state.currentRound.statusRound == RoundStatus.PLAYING) {
            nodes.hintEl.innerHTML = `${state.players[state.currentRound.currentPlayer].name}: your turn!`;
        } else {
            nodes.hintEl.innerHTML = '';
        }

        if(state.players[state.currentRound.currentPlayer].type === PlayerTypes.HUMAN) {
            nodes.boardEl.classList.add('board--human-turn');
        } else {
            nodes.boardEl.classList.remove('board--human-turn');
        }
        
        if(state.currentRound.statusRound == RoundStatus.DRAW || state.currentRound.statusRound == RoundStatus.WIN) {
            nodes.boardEl.classList.remove('board--human-turn');
        }
    }

    function resetBoard() {
        console.log('[screen] resetBoard', state.board, state.scores)

        for(let i = 0; i < nodes.cellsEl.length; i++) {
            nodes.cellsEl[i].classList.add('board__cell--empty');
            nodes.cellsEl[i].classList.remove('board__cell--X');
            nodes.cellsEl[i].classList.remove('board__cell--O');
            nodes.cellsEl[i].classList.remove('board__cell--highlight');
        }
    }

    function drawBoard() {
        console.log('[screen] drawBoard', state.board, state.scores)

        for(let i = 0; i < state.board.cells.length; i++) {
            if(state.board.cells[i] == Symbols.EMPTY) {
                nodes.cellsEl[i].classList.add('board__cell--empty');
            } else {
                nodes.cellsEl[i].classList.remove('board__cell--empty');
                nodes.cellsEl[i].classList.add(`board__cell--${state.board.cells[i]}`);
            }   
            
            // nodes.cellsEl[i].classList.remove('board__cell--highlight');
        }

        // TODO ERRO AO INICIAR NOVO ROUND
        if(state.scores[state.currentRound.round]) {
            const winningCombination = state.scores[state.currentRound.round].combination;
            winningCombination.forEach(cellIndex => {
                nodes.cellsEl[cellIndex].classList.add('board__cell--highlight');
            });
            // console.log('[screen] winning combination', winningCombination)
        }
    }

    function updateScore() {
        nodes.scoreEl.innerHTML = '';

        const roundCounterEl = document.createElement('h1');
        roundCounterEl.innerHTML = `Round: ${state.currentRound.round + 1}/${state.maxRounds}`;
        nodes.scoreEl.appendChild(roundCounterEl);

        const xScoreEl = document.createElement('h1');
        xScoreEl.innerHTML = `${state.players[0].name} (${state.players[0].symbol}): ${state.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 )}`;
        nodes.scoreEl.appendChild(xScoreEl);

        const oScoreEl = document.createElement('h1');
        oScoreEl.innerHTML = `${state.players[1].name} (${state.players[1].symbol}): ${state.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 )}`;
        nodes.scoreEl.appendChild(oScoreEl);

        const drawScoreEl = document.createElement('h1');
        drawScoreEl.innerHTML = `Draws: ${state.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 )}`;
        nodes.scoreEl.appendChild(drawScoreEl);
    }

    function showEndRoundScreen() {
        console.log('[screen] showEndRound', state)
        if(state.currentRound.statusRound == RoundStatus.DRAW) {
            nodes.endRoundScreenEl.querySelector('h1').innerText = `Draw!`;
        } else if(state.currentRound.statusRound == RoundStatus.WIN) {
            nodes.endRoundScreenEl.querySelector('h1').innerText = `${state.players[state.currentRound.currentPlayer].name} won!`;
        }
        nodes.endRoundScreenEl.classList.add('screen--show');
        nodes.endRoundScreenEl.classList.add('animating');

    }

    function startNextRound() {
        console.log('[screen] start next round', state)
        notifyAll({id: 'START_NEXT_ROUND'});
    }

    function showEndGameScreen() {
        nodes.endGameScoreEl.innerHTML = '';

        const roundCounterEl = document.createElement('h1');
        roundCounterEl.innerHTML = `Rounds: ${state.maxRounds}`;
        nodes.endGameScoreEl.appendChild(roundCounterEl);

        const xScoreEl = document.createElement('h1');
        xScoreEl.innerHTML = `${state.players[0].name} (${state.players[0].symbol}): ${state.scores.reduce((acc, val) => (val.winner == Symbols.X ? acc + 1 :  acc), 0 )}`;
        nodes.endGameScoreEl.appendChild(xScoreEl);

        const oScoreEl = document.createElement('h1');
        oScoreEl.innerHTML = `${state.players[1].name} (${state.players[1].symbol}): ${state.scores.reduce((acc, val) => (val.winner == Symbols.O ? acc + 1 :  acc), 0 )}`;
        nodes.endGameScoreEl.appendChild(oScoreEl);

        const drawScoreEl = document.createElement('h1');
        drawScoreEl.innerHTML = `Draws: ${state.scores.reduce((acc, val) => (val.winner == 'Draw' ? acc + 1 :  acc), 0 )}`;
        nodes.endGameScoreEl.appendChild(drawScoreEl);

        nodes.endGameScreenEl.classList.add('screen--show');
        nodes.boardScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.classList.remove('animating');
    }
    
    return {
        subscribe,
        notifyAll,
        observers,
        executeCommand,
        nodes,
        state,
        init,
        showStartScreen,
        createViews,
    }
}