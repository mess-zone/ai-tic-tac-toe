import createObservable from '../src/helpers/createObservable.js';
import createCommandExecutor from '../src/helpers/createCommandExecutor.js';

import createViewController from "../src/ui/createViewController.js";
import createLogic, { createState } from '../src/createLogic.js';

import createViewCommands from '../src/ui/createCommands.js';
import createCommands from '../src/createCommands.js';

// domain
const gameState = createState();
const logic = createLogic(gameState);

const gameObservable = createObservable();
const logicCommands = createCommands(logic, gameObservable);
// controllers
const gameController = createCommandExecutor(logicCommands);
window.gameController = gameController;


const screenObservable = createObservable();
// views
const views = createViewController(window, screenObservable);
const viewCommands = createViewCommands(views);
// presenters
const gamePresenter = createCommandExecutor(viewCommands);
window.gamePresenter = gamePresenter;


// observers subscribe
gameObservable.subscribe(gamePresenter.executeCommand);
screenObservable.subscribe(gameController.executeCommand);

//init game
views.createAllViews();
gamePresenter.executeCommand({id: "SETUP"});