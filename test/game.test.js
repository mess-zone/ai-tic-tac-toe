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

    describe('#move()', function() {

        game = createGame();
        game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });


        it('Should move player 1 to empty destination cell', function() {
            game.state.currentRound.currentPlayer = 0
            game.move(0, 0);

            expect(game.state.board.cells[0]).to.equal(Symbols.X);
        });
        it('Should move player 2 to empty destination cell', function() {
            game.state.currentRound.currentPlayer = 1
            console.log('CURRENT PLAYER: ', game.state.currentRound.currentPlayer)
            game.move(1, 2);

            expect(game.state.board.cells[2]).to.equal(Symbols.O);
        });
        it('Should not move player if it destination cell is not empty', function() {
            game.state.currentRound.currentPlayer = 0
            game.move(0, 2);

            expect(game.state.board.cells[2]).to.equal(Symbols.O);
        });
        it('Should not move player if it destination cell does not exists', function() {
            game.state.currentRound.currentPlayer = 0
            game.move(0, 9);

            expect(game.state.board.cells[9]).to.equal(undefined);
        });
        it('Should not move player if it is not his current turn', function() {
            game.state.currentRound.currentPlayer = 0
            game.move(1, 1);

            expect(game.state.board.cells[1]).to.equal(Symbols.EMPTY);
        });
        it('Should not move player if round status is not PLAYING', function() {
            game.state.currentRound.currentPlayer = 0
            game.state.currentRound.statusRound = RoundStatus.DRAW
            game.move(0, 1);

            expect(game.state.board.cells[1]).to.equal(Symbols.EMPTY);
        });

        it('Should not move player if game status is not RUNNING', function() {
            game.state.currentRound.currentPlayer = 0
            game.state.statusGame = GameStatus.ENDED
            game.move(0, 1);

            expect(game.state.board.cells[1]).to.equal(Symbols.EMPTY);
        });

    });

    describe('#searchWinningCombination()', function() {
        beforeEach(function() {
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
        });

        it('Should find winning combination 0 1 2', function() {
            game.state.board.cells[0] = Symbols.X;
            game.state.board.cells[1] = Symbols.X;
            game.state.board.cells[2] = Symbols.X;

            const combination = game.searchWinningCombination(Symbols.X);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(0);
            expect(combination[1]).to.equal(1);
            expect(combination[2]).to.equal(2);
        });

        it('Should find winning combination 3 4 5', function() {
            game.state.board.cells[3] = Symbols.X;
            game.state.board.cells[4] = Symbols.X;
            game.state.board.cells[5] = Symbols.X;

            const combination = game.searchWinningCombination(Symbols.X);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(3);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(5);
        });

        it('Should find winning combination 6 7 8', function() {
            game.state.board.cells[6] = Symbols.X;
            game.state.board.cells[7] = Symbols.X;
            game.state.board.cells[8] = Symbols.X;

            const combination = game.searchWinningCombination(Symbols.X);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(6);
            expect(combination[1]).to.equal(7);
            expect(combination[2]).to.equal(8);
        });

        it('Should find winning combination 0 3 6', function() {
            game.state.board.cells[0] = Symbols.O;
            game.state.board.cells[3] = Symbols.O;
            game.state.board.cells[6] = Symbols.O;

            const combination = game.searchWinningCombination(Symbols.O);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(0);
            expect(combination[1]).to.equal(3);
            expect(combination[2]).to.equal(6);
        });

        it('Should find winning combination 1 4 7', function() {
            game.state.board.cells[1] = Symbols.O;
            game.state.board.cells[4] = Symbols.O;
            game.state.board.cells[7] = Symbols.O;

            const combination = game.searchWinningCombination(Symbols.O);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(1);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(7);
        });

        it('Should find winning combination 2 5 8', function() {
            game.state.board.cells[2] = Symbols.O;
            game.state.board.cells[5] = Symbols.O;
            game.state.board.cells[8] = Symbols.O;

            const combination = game.searchWinningCombination(Symbols.O);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(2);
            expect(combination[1]).to.equal(5);
            expect(combination[2]).to.equal(8);
        });

        it('Should find winning combination 0 4 8', function() {
            game.state.board.cells[0] = Symbols.X;
            game.state.board.cells[4] = Symbols.X;
            game.state.board.cells[8] = Symbols.X;

            const combination = game.searchWinningCombination(Symbols.X);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(0);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(8);
        });

        it('Should find winning combination 2 4 6', function() {
            game.state.board.cells[2] = Symbols.X;
            game.state.board.cells[4] = Symbols.X;
            game.state.board.cells[6] = Symbols.X;

            const combination = game.searchWinningCombination(Symbols.X);

            expect(combination).to.have.lengthOf(3);
            expect(combination[0]).to.equal(2);
            expect(combination[1]).to.equal(4);
            expect(combination[2]).to.equal(6);
        });


        it('Should not find winning combination when is draw', function() {
            game.state.board.cells[0] = Symbols.X;
            game.state.board.cells[1] = Symbols.O;
            game.state.board.cells[2] = Symbols.X;
            game.state.board.cells[3] = Symbols.X;
            game.state.board.cells[4] = Symbols.O;
            game.state.board.cells[5] = Symbols.X;
            game.state.board.cells[6] = Symbols.O;
            game.state.board.cells[7] = Symbols.X;
            game.state.board.cells[8] = Symbols.O;

            const combinationX = game.searchWinningCombination(Symbols.X);
            expect(combinationX).to.have.lengthOf(0);
            
            const combinationO = game.searchWinningCombination(Symbols.O);
            expect(combinationO).to.have.lengthOf(0);

        });

        it('Should not find winning combination when the board is empty', function() {
            game.state.board.cells[0] = Symbols.EMPTY;
            game.state.board.cells[1] = Symbols.EMPTY;
            game.state.board.cells[2] = Symbols.EMPTY;
            game.state.board.cells[3] = Symbols.EMPTY;
            game.state.board.cells[4] = Symbols.EMPTY;
            game.state.board.cells[5] = Symbols.EMPTY;
            game.state.board.cells[6] = Symbols.EMPTY;
            game.state.board.cells[7] = Symbols.EMPTY;
            game.state.board.cells[8] = Symbols.EMPTY;

            const combinationX = game.searchWinningCombination(Symbols.X);
            expect(combinationX).to.have.lengthOf(0);
            
            const combinationO = game.searchWinningCombination(Symbols.O);
            expect(combinationO).to.have.lengthOf(0);
        });
    });

    describe.only('#updateRoundStatus()', function() {
        beforeEach(function() {
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
        });

        it('Draw', function() {
            game.state.board.cells[0] = Symbols.X;
            game.state.board.cells[1] = Symbols.O;
            game.state.board.cells[2] = Symbols.X;
            game.state.board.cells[3] = Symbols.X;
            game.state.board.cells[4] = Symbols.O;
            game.state.board.cells[5] = Symbols.X;
            game.state.board.cells[6] = Symbols.O;
            game.state.board.cells[7] = Symbols.X;
            game.state.board.cells[8] = Symbols.O;

            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            expect(game.hasEmptyCells()).to.equal(false);
            const hasWinningCombination = false;
            game.updateRoundStatus(hasWinningCombination);
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.DRAW);
        });
        it('Victory', function() {
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            const hasWinningCombination = true;
            game.updateRoundStatus(hasWinningCombination);
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.WIN);
        });
        it('Round stil in progress', function() {
            game.state.board.cells[0] = Symbols.X;
            game.state.board.cells[1] = Symbols.O;
            game.state.board.cells[2] = Symbols.X;
            game.state.board.cells[3] = Symbols.X;
            game.state.board.cells[4] = Symbols.O;
            game.state.board.cells[5] = Symbols.X;
            game.state.board.cells[6] = Symbols.O;
            game.state.board.cells[7] = Symbols.X;
            game.state.board.cells[8] = Symbols.EMPTY;

            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);
            expect(game.hasEmptyCells()).to.equal(true);
            const hasWinningCombination = false;
            game.updateRoundStatus(hasWinningCombination);
            expect(game.state.currentRound.statusRound).to.equal(RoundStatus.PLAYING);
        });
    });

    describe('#hasEmptyCells()', function() {
        beforeEach(function() {
            console.log('create new Game')
            game = createGame();
            game.setup({ name: 'player 1', type: PlayerTypes.HUMAN }, { name: 'player 2', type: PlayerTypes.HUMAN });
        });

        it('Does not have empty cells', function() {
            game.state.board.cells[0] = Symbols.X;
            game.state.board.cells[1] = Symbols.O;
            game.state.board.cells[2] = Symbols.X;
            game.state.board.cells[3] = Symbols.X;
            game.state.board.cells[4] = Symbols.O;
            game.state.board.cells[5] = Symbols.X;
            game.state.board.cells[6] = Symbols.O;
            game.state.board.cells[7] = Symbols.X;
            game.state.board.cells[8] = Symbols.O;

            const hasEmptyCells = game.hasEmptyCells();

            expect(hasEmptyCells).to.equal(false);
        });
        it('Does have some empty cells', function() {
            game.state.board.cells[0] = Symbols.X;
            game.state.board.cells[1] = Symbols.O;
            game.state.board.cells[2] = Symbols.X;
            game.state.board.cells[3] = Symbols.EMPTY;
            game.state.board.cells[4] = Symbols.O;
            game.state.board.cells[5] = Symbols.X;
            game.state.board.cells[6] = Symbols.O;
            game.state.board.cells[7] = Symbols.X;
            game.state.board.cells[8] = Symbols.O;

            const hasEmptyCells = game.hasEmptyCells();

            expect(hasEmptyCells).to.equal(true);
        });
        it('Has all empty cells', function() {
            const hasEmptyCells = game.hasEmptyCells();

            expect(hasEmptyCells).to.equal(true);
        });
    });
});