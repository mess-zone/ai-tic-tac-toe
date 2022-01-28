import createObservable from '../src/helpers/createObservable.js';
import createCommandExecutor from '../src/helpers/createCommandExecutor.js';

import createViews from "../src/createViews.js";
import createLogic, { createState } from '../src/createLogic.js';

import createViewCommands from '../src/createViewCommands.js';
import createLogicCommands from '../src/createLogicCommands.js';

// domain
const gameState = createState();
const logic = createLogic(gameState);

const gameObservable = createObservable();
const logicCommands = createLogicCommands(logic, gameObservable);
// controller
const gameController = createCommandExecutor(logicCommands);
// window.gameController = gameController;


const screenObservable = createObservable();
// view
const views = createViews(window, screenObservable);
const viewCommands = createViewCommands(views);
// presenter
const gamePresenter = createCommandExecutor(viewCommands);
// window.gamePresenter = gamePresenter;


// observers subscribe
gameObservable.subscribe(gamePresenter.executeCommand);
screenObservable.subscribe(gameController.executeCommand);

//init game
views.createAllViews();
gamePresenter.executeCommand({id: "SETUP"});