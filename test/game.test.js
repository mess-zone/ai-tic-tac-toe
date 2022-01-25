import {expect} from 'chai';
import createGame, { PlayerTypes, Symbols, GameStatus, RoundStatus } from '../src/createGame.js'


describe('game', function() {
    let game = {};
    
    
    describe('#setPlayers()', function() {

        beforeEach(function() {
            game = createGame();
        });

        it('Should create 2 users of type human', function() {

            game.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });

            expect(game.state.players).to.have.lengthOf(2);

            expect(game.state.players[0].name).to.equal('player 1');
            expect(game.state.players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[0].symbol).to.equal(Symbols.X);

            expect(game.state.players[1].name).to.equal('player 2');
            expect(game.state.players[1].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create a user of type human and a user of type computer', function() {

            game.setPlayers({ name: 'human', type: PlayerTypes.HUMAN }, { name: 'computer', type: PlayerTypes.COMPUTER });

            expect(game.state.players).to.have.lengthOf(2);

            expect(game.state.players[0].name).to.equal('human');
            expect(game.state.players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[0].symbol).to.equal(Symbols.X);

            expect(game.state.players[1].name).to.equal('computer');
            expect(game.state.players[1].type).to.equal(PlayerTypes.COMPUTER);
            expect(game.state.players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create users with default names', function() {

            game.setPlayers({ type: PlayerTypes.HUMAN }, { type: PlayerTypes.HUMAN });

            expect(game.state.players).to.have.lengthOf(2);

            expect(game.state.players[0].name).to.equal('player 1');
            expect(game.state.players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[0].symbol).to.equal(Symbols.X);

            expect(game.state.players[1].name).to.equal('player 2');
            expect(game.state.players[1].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[1].symbol).to.equal(Symbols.O);
        });

        it('Should create users with default types', function() {

            game.setPlayers({ }, { });

            expect(game.state.players).to.have.lengthOf(2);

            expect(game.state.players[0].name).to.equal('player 1');
            expect(game.state.players[0].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[0].symbol).to.equal(Symbols.X);

            expect(game.state.players[1].name).to.equal('player 2');
            expect(game.state.players[1].type).to.equal(PlayerTypes.HUMAN);
            expect(game.state.players[1].symbol).to.equal(Symbols.O);
        });


    });

    describe('#resetGame()', function() {

        beforeEach(function() {
            game = createGame();
        });

        it('Should reset the scores e rounds', function() {
            game.resetGame();

            expect(game.state.statusGame).to.equal(GameStatus.RUNNING);
            expect(game.state.currentRound.round).to.equal(-1);
            expect(game.state.currentRound.currentPlayer).to.equal(-1);
            expect(game.state.currentRound.statusRound).to.equal(null);
            expect(game.state.scores).to.have.lengthOf(0);

        });
        it('Should restart the scores e rounds after ended the game', function() {
            game.statusGame = GameStatus.ENDED;
            game.state.currentRound.round = 2;
            game.state.currentRound.currentPlayer = 1;
            game.state.currentRound.statusRound = RoundStatus.DRAW;
    
            game.state.scores = [
                {
                    winner: 0, combination: [0, 1, 2],
                },
                {
                    winner: 1, combination: [0, 1, 2],
                },
                {
                    winner: 1, combination: [0, 1, 2],
                },
            ];

            game.resetGame();

            expect(game.state.statusGame).to.equal(GameStatus.RUNNING);
            expect(game.state.currentRound.round).to.equal(-1);
            expect(game.state.currentRound.currentPlayer).to.equal(-1);
            expect(game.state.currentRound.statusRound).to.equal(null);
            expect(game.state.scores).to.have.lengthOf(0);

        });

    });

    describe('#endGame()', function() {

        beforeEach(function() {
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
        });

        it('Should end the game', function() {
            game.endGame();

            expect(game.state.statusGame).to.equal(GameStatus.ENDED);

        });

        it('Should notify END_GAME')

    });

    describe('#startNextRound()', function() {

        beforeEach(function() {
            game = createGame();
            game.setPlayers({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            game.resetGame();
        });

        it('Should start the 1º round', function() {
            game.startNextRound();

            expect(game.state.board.cells.filter(cell => cell == Symbols.EMPTY)).to.have.lengthOf(9);
            expect(game.state.currentRound.round).to.equal(0);
            expect(game.state.currentRound.currentPlayer).to.equal(0);
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);

        });
        it('Should start the 2º round', function() {
            game.startNextRound();
            game.state.currentRound.statusRound = RoundStatus.WIN;
            game.startNextRound();

            expect(game.state.board.cells.filter(cell => cell == Symbols.EMPTY)).to.have.lengthOf(9);
            expect(game.state.currentRound.round).to.equal(1);
            expect(game.state.currentRound.currentPlayer).to.equal(0);
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);

        });
        it('Should start the 3º round', function() {
            game.startNextRound();
            game.state.currentRound.statusRound = RoundStatus.WIN;
            game.startNextRound();
            game.state.currentRound.statusRound = RoundStatus.WIN;
            game.startNextRound();

            expect(game.state.board.cells.filter(cell => cell == Symbols.EMPTY)).to.have.lengthOf(9);
            expect(game.state.currentRound.round).to.equal(2);
            expect(game.state.currentRound.currentPlayer).to.equal(0);
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);

        });

        it('Should not start the next round if is out of the limit of maxRounds', function() {
            for(let i = 0; i <= game.state.maxRounds; i++) {
                game.startNextRound();
                game.state.currentRound.statusRound = RoundStatus.WIN;
            }
            console.log(game.state)
            expect(game.state.currentRound.round).to.equal(game.state.maxRounds - 1);

        });

        it('Should not start the next round if the game is ENDED', function() {
            game.startNextRound();
            game.endGame();
            expect(game.state.statusGame).to.equal(GameStatus.ENDED)

            game.startNextRound();
            expect(game.state.statusGame).to.equal(GameStatus.ENDED)
            expect(game.state.currentRound.round).to.equal(0);

        });

        it('Should not start the next round without finishing the current', function() {
            game.startNextRound();
            game.startNextRound();
            expect(game.state.currentRound.round).to.equal(0);

        });

        it('Should notify START_ROUND');

    });

    describe.only('#move()', function() {

        // beforeEach(function() {
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
            // game.startGame();
        // });

        it('Should move player 1 to empty destination cell', function() {
            game.move(0, 0);

            expect(game.state.board.cells[0]).to.equal(Symbols.X);
        });
        it('Should move player 2 to empty destination cell', function() {
            game.move(1, 2);

            expect(game.state.board.cells[2]).to.equal(Symbols.O);
        });
        it('Should not move player if it destination cell is not empty', function() {
            game.move(0, 2);

            expect(game.state.board.cells[2]).to.equal(Symbols.O);
        });
        it('Should not move player if it destination cell does not exists', function() {
            game.move(0, 9);

            expect(game.state.board.cells[9]).to.equal(undefined);
        });
        it('Should not move player if it is not his current turn', function() {
            game.move(1, 1);

            expect(game.state.board.cells[1]).to.equal(Symbols.EMPTY);
        });
        it('Should not move player if round status is not PLAYING', function() {
            game.state.currentRound.statusRound = RoundStatus.DRAW
            game.move(0, 1);

            expect(game.state.board.cells[1]).to.equal(Symbols.EMPTY);
        });

        it('Should not move player if game status is not RUNNING', function() {
            game.state.statusGame = GameStatus.ENDED
            game.move(0, 1);

            expect(game.state.board.cells[1]).to.equal(Symbols.EMPTY);
        });

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