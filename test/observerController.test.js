import {expect} from 'chai';
import createObserverController from '../src/createObserverController.js';

describe('observerController', function() {
    describe('#subscribe()', function() {
        it('Should subscribe a valid callback function', function() {
            const sut = createObserverController();
            const validCallback = function() {};

            sut.subscribe(validCallback);

            expect(sut.observers.length).to.equal(1);
            expect(sut.observers[0]).to.equal(validCallback);
            expect(typeof sut.observers[0]).to.equal('function');
        });

        it('Should throw if receive no param', function() {
            const sut = createObserverController();
            expect(() => { sut.subscribe() }).to.throw();
        });

        it('Should throw if receive invalid param', function() {
            const sut = createObserverController();
            expect(() => { sut.subscribe('invalid_param') }).to.throw();
        });
    });

    describe('#notifyAll', function() {
        it('Should notify all subscribers when receive a valid command', function() {
            const sut = createObserverController();

            let counter = 0;
            const validCallback = function() {
                counter++;
            };

            sut.subscribe(validCallback);
            sut.subscribe(validCallback);
            sut.subscribe(validCallback);

            const valid_command = {};
            sut.notifyAll(valid_command);

            expect(counter).to.equal(3);
        });

        it('Should notify all subscribers even if receive no param', function() {
            const sut = createObserverController();

            let counter = 0;
            const validCallback = function() {
                counter++;
            };

            sut.subscribe(validCallback);
            sut.subscribe(validCallback);
            sut.subscribe(validCallback);

            sut.notifyAll();

            expect(counter).to.equal(3);
        });
    });
});