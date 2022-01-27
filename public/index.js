import createScreen from "./../src/createScreen.js";

// view
const gameScreen = createScreen(window);
gameScreen.init();
window.gameScreen = gameScreen;



import createLogic, { createState } from '../src/createLogic.js';
import createObserverController from '../src/createObserverController.js';
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



gameScreen.subscribe(gameController.executeCommand);
gameScreen.executeCommand({id: "SETUP"});