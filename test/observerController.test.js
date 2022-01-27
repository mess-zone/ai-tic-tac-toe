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
});