import createGame from "./../src/createGame.js";
import createScreen from "./../src/createScreen.js";

const gameScreen = createScreen(window);
gameScreen.init();
window.gameScreen = gameScreen;




const game = createGame();
window.game = game;

console.log(game.state)

game.subscribe(gameScreen.executeCommand);
gameScreen.subscribe(game.executeCommand);

gameScreen.executeCommand({id: "SETUP"});