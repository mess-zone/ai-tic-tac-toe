
export default function createObserverController() {
    const observers = [];

    function subscribe(observerFunction) {
        observers.push(observerFunction)
    }

    function notifyAll(command) {
        for (const observerFunction of observers) {
            observerFunction(command)
        }
    }

    return {
        observers,
        subscribe,
        notifyAll
    }
}