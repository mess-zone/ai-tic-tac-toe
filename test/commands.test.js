import {expect} from 'chai';
import { createState, createObserverController, createLogic, createCommands, PlayerTypes, Symbols, GameStatus, RoundStatus } from '../src/createGame.js'

describe('commands', function() {

    let gameState;
    let logic;
    let observerControllerSpy;
    let commands;

    describe('SETUP', function() {
        it('Should start first round when receive valid params', function() {
            gameState = createState();
            logic = createLogic(gameState);

            observerControllerSpy = createObserverController();
            observerControllerSpy.subscribe(cmd => {
                console.log('OBSERVER NOTIFIED', cmd.state)
                expect(cmd.id).to.equal('START_ROUND');
                expect(cmd.state.statusGame).to.equal(GameStatus.RUNNING);
                expect(cmd.state.board.cells.length).to.equal(9);
                expect(cmd.state.board.cells.every(cell => cell === Symbols.EMPTY)).to.equal(true);
                expect(cmd.state.currentRound).to.deep.equal({
                    round: 0,
                    currentPlayer: 0,
                    statusRound: RoundStatus.PLAYING
                });
                expect(cmd.state.scores.length).to.equal(0);
                expect(cmd.state.players).to.deep.equal([
                    { name: 'player 1', type: PlayerTypes.HUMAN, symbol: Symbols.X },
                    { name: 'player 2', type: PlayerTypes.HUMAN, symbol: Symbols.O }
                ]);
            });
            
            commands = createCommands(logic, observerControllerSpy);
            const command = { 
                id: 'SETUP',
                player1: { name: 'player 1', type: PlayerTypes.HUMAN }, 
                player2: { name: 'player 2', type: PlayerTypes.HUMAN } 
            };
            commands.SETUP(command);
            
        });

        it('Should throw an error if receive invalid params', function() {
            gameState = createState();
            logic = createLogic(gameState);

            observerControllerSpy = createObserverController();

            commands = createCommands(logic, observerControllerSpy);
            const command = { 
                id: 'SETUP', 
            };
            expect(() => commands.SETUP(command)).to.throw();
        });
    })
});