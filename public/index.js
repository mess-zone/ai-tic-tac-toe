import createPresenter from "../src/ui/createPresenter.js";
import createViewController from "../src/ui/createViewController.js";
import createViewCommands from '../src/ui/createCommands.js';
import createLogic, { createState } from '../src/createLogic.js';
import createObserverController from '../src/helpers/createObserverController.js';
import createCommands from '../src/createCommands.js';
import createGameController from '../src/createGameController.js';

// domain
const gameState = createState();
const logic = createLogic(gameState);

// infra
const observerController = createObserverController();
const commands = createCommands(logic, observerController);
const gameController = createGameController(commands);
window.game = gameController;
console.log(gameState);


// view
const nodes = {};
const screenObserver = createObserverController();
const viewsController = createViewController(window, nodes, screenObserver);
const viewCommands = createViewCommands(viewsController);
const gameScreen = createPresenter(viewCommands);
window.gameScreen = gameScreen;


// observers subscribe
observerController.subscribe(gameScreen.executeCommand);
screenObserver.subscribe(gameController.executeCommand);

//init game
// gameScreen.init();
viewsController.createAllViews();
gameScreen.executeCommand({id: "SETUP"});