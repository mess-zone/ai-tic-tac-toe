import {expect} from 'chai';
import createGameController from '../src/createGameController.js';

describe('gameController', function() {
    describe('#executeCommand()', function() {
        it('Should throw if receive no argument', function() {
            const commandsSpy = {};

            const sut = createGameController(commandsSpy);

            expect(() => { sut.executeCommand() }).to.throw('Invalid command');
        });

        it('Should throw if receive a command with no id', function() {
            const commandsSpy = {};

            const sut = createGameController(commandsSpy);

            const invalidCommand = {}; 

            expect(() => { sut.executeCommand(invalidCommand) }).to.throw('Invalid command');
        });

        it('Should throw if receive a command with invalid command id', function() {
            const commandsSpy = {};

            const sut = createGameController(commandsSpy);

            const inexistentCommand = {
                id: 'invalid_id'
            }; 

            expect(() => { sut.executeCommand(inexistentCommand) }).to.throw('Invalid command');

        });

        it('Should execute a command if it exists', function() {
            let counter = 0;
            const commandsSpy = {
                valid_id: function() {
                    counter++;
                }
            };

            const sut = createGameController(commandsSpy);

            const validCommand = {
                id: 'valid_id'
            }; 

            sut.executeCommand(validCommand);
            sut.executeCommand(validCommand);
            expect(counter).to.equal(2);

        });
    });
});