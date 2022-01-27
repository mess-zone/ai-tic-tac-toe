export default function createGameController(commands) {

    function executeCommand(command) {
        if(!command || !command.id || !commands[command.id]) throw 'Invalid command';

        console.log('[game] executeCommand ', command);

        const commandId = command.id;
        commands[commandId](command);
    }

    return {
        executeCommand,
        commands,
    }

}
