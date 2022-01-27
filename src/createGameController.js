export default function createGameController(commands) {

    function executeCommand(command) {
        console.log('[game] executeCommand ', command);

        const commandId = command.id;

        commands[commandId](command);
    }

    return {
        executeCommand,
        commands,
    }

}
