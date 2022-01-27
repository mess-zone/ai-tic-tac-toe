import createScreen from "../src/view/createScreen.js";
import createViewController from "../src/view/createViewController.js";

// view
const nodes = {};
const viewsController = createViewController(window, nodes);
const screenObserver = createObserverController();
const gameScreen = createScreen(viewsController, screenObserver);
gameScreen.init();
window.gameScreen = gameScreen;



import createLogic, { createState } from '../src/createLogic.js';
import createObserverController from '../src/helpers/createObserverController.js';
import createCommands from '../src/createCommands.js';
import createGameController from '../src/createGameController.js';

// domain
const gameState = createState();
const logic = createLogic(gameState);

// infra
const observerController = createObserverController();
observerController.subscribe(gameScreen.executeCommand);
const commands = createCommands(logic, observerController);
const gameController = createGameController(commands);
window.game = gameController;
console.log(gameState);



screenObserver.subscribe(gameController.executeCommand);
gameScreen.executeCommand({id: "SETUP"});