
export default function createObserverController() {
    const observers = [];

    function subscribe(observerFunction) {
        if(observerFunction) {
            if(typeof observerFunction === 'function') {
                observers.push(observerFunction);
            } else {
                throw 'Invalid param';
            }
        } else {
            throw 'Invalid param';
        }
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command);
        }
    }

    return {
        observers,
        subscribe,
        notifyAll
    }
}