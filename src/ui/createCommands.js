export default function createCommands(viewsController) {
    
    function SETUP() {
        viewsController.showStartScreen();
    }

    return {
        SETUP,
    }
}