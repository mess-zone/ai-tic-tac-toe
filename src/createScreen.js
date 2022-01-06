export default function createScreen(window) {
    let nodes = {};

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
        console.log('[screen] init')
        nodes.startScreenEl = window.document.getElementById('start-screen');
        nodes.roundScreenEl = window.document.getElementById('round-screen');
        nodes.endRoundScreenEl = window.document.getElementById('end-round-screen');
        nodes.endGameScreenEl = window.document.getElementById('end-game-screen');


        nodes.boardScreenEl = window.document.getElementById('board-screen');
        nodes.scoreEl =  nodes.boardScreenEl.querySelector('#score');
        nodes.hintEl =  nodes.boardScreenEl.querySelector('#hint');
        nodes.boardContainerEl =  nodes.boardScreenEl.querySelector('#board-container');
        nodes.boardEl =  nodes.boardScreenEl.querySelector('#board');
        nodes.cellsEl =  nodes.boardEl.querySelectorAll('.board__cell');

        window.addEventListener('resize', handleResize);

        nodes.startScreenEl.querySelector('form').addEventListener('submit', configurePlayers);
    }

    function handleResize(e) {
        console.log(e)
        console.log(nodes.boardContainerEl.offsetWidth, nodes.boardContainerEl.offsetHeight)
        const side = nodes.boardContainerEl.offsetWidth <= nodes.boardContainerEl.offsetHeight ? nodes.boardContainerEl.offsetWidth : nodes.boardContainerEl.offsetHeight;

        nodes.boardEl.style.width = side + 'px';
        nodes.boardEl.style.height = side + 'px';
    }

    function executeCommand(command) {
        console.log('[screen] executeCommand ', command);

        if(command.id == 'SETUP') {
            showStartScreen();
        } else if(command.id == 'START_ROUND') {
            showRoundScreen();
        }
    }

    function showStartScreen() {
        nodes.startScreenEl.classList.add('screen--show');
    }

    function showRoundScreen() {
        nodes.endRoundScreenEl.classList.remove('screen--show');
        nodes.endGameScreenEl.classList.remove('screen--show');
        nodes.roundScreenEl.querySelector('h1').innerText = `Round ?/??`;
        nodes.roundScreenEl.classList.add('screen--show');
        nodes.roundScreenEl.classList.add('animating');
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

        console.log('configure players', player1, player2);

        // TODO notify game
        notifyAll({ id: 'SETUP', player1, player2 });
        // this.players = [];            
        // this.players.push((player1.type == 'human') ? new HumanPlayer(player1.name, 'x') : new ComputerPlayer(player1.name, 'x'));
        // this.players.push((player2.type == 'human') ? new HumanPlayer(player2.name, 'o') : new ComputerPlayer(player2.name, 'o'));

        // this.score = [
        //     { label: this.players[0].name , points: 0 },
        //     { label: this.players[1].name , points: 0 },
        //     { label: 'Draws' , points: 0 },
        // ];
        
        // startNewRound();
    }
    
    return {
        subscribe,
        notifyAll,
        observers,
        executeCommand,
        nodes,
        init,
        showStartScreen,
    }
}