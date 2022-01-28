import createObserverController from '../src/helpers/createObserverController.js';
import createCommandExecutor from '../src/helpers/createCommandExecutor.js';

import createViewController from "../src/ui/createViewController.js";
import createLogic, { createState } from '../src/createLogic.js';

import createViewCommands from '../src/ui/createCommands.js';
import createCommands from '../src/createCommands.js';

// domain
const gameState = createState();
const logic = createLogic(gameState);

// controllers
const observerController = createObserverController();
const commands = createCommands(logic, observerController);
const gameController = createCommandExecutor(commands);
window.game = gameController;
console.log(gameState);


// presenters
const nodes = {};
const screenObserver = createObserverController();
const views = createViewController(window, nodes, screenObserver);
const viewCommands = createViewCommands(views);
const gamePresenter = createCommandExecutor(viewCommands);
window.gamePresenter = gamePresenter;


// observers subscribe
observerController.subscribe(gamePresenter.executeCommand);
screenObserver.subscribe(gameController.executeCommand);

//init game
views.createAllViews();
gamePresenter.executeCommand({id: "SETUP"});