import {expect} from 'chai';
import createGame, { PlayerTypes, Symbols, GameStatus, RoundStatus } from '../src/createGame.js'


describe('game', function() {
    let game = {};
    
    
    describe('#setup()', function() {

        beforeEach(function() {
            game = createGame();
            console.log('create new Game')
        });

        it('Should create 2 users of type human', function() {

            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });

            expect(game.state.players).to.have.lengthOf(2);

            expect(game.state.players[0].name).to.equal('player 1');
            expect(game.state.players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[0].symbol).to.equal(Symbols.X);

            expect(game.state.players[1].name).to.equal('player 2');
            expect(game.state.players[1].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create users with default names');

        it('Should create users with default types');
    });

    describe('#startGame()', function() {

        beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
        });

        it('Should start the scores e rounds', function() {
            game.startGame();

            expect(game.state.statusGame).to.equal(GameStatus.RUNNING);
            expect(game.state.scores).to.have.lengthOf(0);

        });
        it('Should restart the scores e rounds after ended the game');

    });

    describe('#endGame()', function() {

        beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            game.startGame();
        });

        it('Should end the game', function() {
            game.endGame();

            expect(game.state.statusGame).to.equal(GameStatus.ENDED);

        });

    });

    describe('#startNextRound()', function() {

        beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            game.startGame();
        });

        it('Should not start the next round without finishing the current');
        it('Should not start the next round if is out of the limit of maxRounds');
        it('Should not start the next round if the game is ENDED');

        it('Should start the second round', function() {
            game.startNextRound();

            expect(game.state.board.cells.filter(cell => cell == Symbols.EMPTY)).to.have.lengthOf(9);
            expect(game.state.currentRound.round).to.equal(1);
            expect(game.state.currentRound.currentPlayer).to.equal(0);
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);

        });

    });

    describe('#move()', function() {

        // beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            game.startGame();
        // });

        it('Should move player 1 to empty destination cell', function() {
            game.move(0, 0);

            expect(game.state.board.cells[0]).to.equal(Symbols.X);
        });
        it('Should move player 2 to empty destination cell', function() {
            game.move(1, 2);

            expect(game.state.board.cells[2]).to.equal(Symbols.O);
        });
        it('Should not move player if game status is not RUNNING');
        it('Should not move player if round status is not PLAYING');
        it('Should not move player if it is not his current turn');
        it('Should not move player if it destination cell is not empty');
        it('Should not move player if it destination cell does not exists');

    });

    describe('#searchWinningCombination', function() {
        beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            game.startGame();
            game.move(0, 0);
            game.move(1, 2);
            game.move(0, 3);
            game.move(1, 1);
            game.move(0, 6);
        });

        it('Should find winning combination 0 3 6', function() {
            const combination = game.searchWinningCombination(Symbols.X);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(0);
            expect(combination[1]).to.equal(3);
            expect(combination[2]).to.equal(6);
        });
        it('Should find winning combination horizontal...');
        it('Should find winning combination diagonal...');
        it('Should not find winning combination');
    });

    describe('#checkEndOfRound()', function() {
        beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            game.startGame();
            game.move(0, 0);
            game.move(1, 2);
            game.move(0, 3);
            game.move(1, 1);
            game.move(0, 6);
        });

        it('Draw');
        it('X won', function() {
            game.checkEndOfRound(Symbols.X);

            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.WIN);
        });
        it('O won');
        it('Round stil in progress');
    });

    describe('#hasEmptyCells()', function() {
        beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            game.startGame();
            game.move(0, 0);
            game.move(1, 2);
            game.move(0, 3);
            game.move(1, 1);
            game.move(0, 6);
        });

        it('Does not have empty cells');
        it('Has empty cells', function() {
            const hasEmptyCells = game.hasEmptyCells();

            expect(hasEmptyCells).to.equal(true);
        });
    });
});