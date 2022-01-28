import createViewController from "../src/ui/createViewController.js";
import createViewCommands from '../src/ui/createCommands.js';
import createLogic, { createState } from '../src/createLogic.js';
import createObserverController from '../src/helpers/createObserverController.js';
import createCommands from '../src/createCommands.js';
import createCommandExecutor from '../src/helpers/createCommandExecutor.js';

// domain
const gameState = createState();
const logic = createLogic(gameState);

// infra
const observerController = createObserverController();
const commands = createCommands(logic, observerController);
const gameController = createCommandExecutor(commands);
window.game = gameController;
console.log(gameState);


// view
const nodes = {};
const screenObserver = createObserverController();
const viewsController = createViewController(window, nodes, screenObserver);
const viewCommands = createViewCommands(viewsController);
const gamePresenter = createCommandExecutor(viewCommands);
window.gamePresenter = gamePresenter;


// observers subscribe
observerController.subscribe(gamePresenter.executeCommand);
screenObserver.subscribe(gameController.executeCommand);

//init game
// gamePresenter.init();
viewsController.createAllViews();
gamePresenter.executeCommand({id: "SETUP"});