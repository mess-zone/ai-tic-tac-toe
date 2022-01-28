export default function createPresenter(viewsController, commands) {

    function init() {
        console.log('[screen] init')
        viewsController.createAllViews();
    }

    function executeCommand(command) {
        if(!command || !command.id || !commands[command.id]) throw 'Invalid command';

        console.log('[screen] executeCommand ', command);

        const commandId = command.id;
        commands[commandId](command);

        // if(command.id == 'SETUP') {
        //     commands.SETUP(command);
        // } else if(command.id == 'START_ROUND') {
        //     commands.START_ROUND(command);
        // } else if(command.id == 'UPDATE_BOARD') {
        //     commands.UPDATE_BOARD(command);
        // } else if(command.id == 'END_ROUND') {
        //     commands.END_ROUND(command);
        // } else if(command.id == 'END_GAME') {
        //     commands.END_GAME(command);
        // }
        
    }

    return {
        executeCommand,
        init,
    }
}
