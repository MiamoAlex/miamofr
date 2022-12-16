/**
 * MiniGameController représente un controlleur de minijeu, avec ses propres gestionnaires d'évenements,
 * tous les mini jeux en héritent
 */
export class MiniGameController {

    constructor(uiController, exitState) {
        this.uiController = uiController;
        this.exitState = exitState;
        this.audioManager = this.uiController.audioManager;
        this.uiRenderer = this.uiController.uiRenderer;
        this.eventHandler = this.uiController.eventHandler;
        this.dataManager = this.uiController.dataManager;
        this.dataManager.playMode = 'minigame';
        if (this.dataManager.save.minigameStats[this.constructor.name]) {
            this.stats = this.dataManager.save.minigameStats[this.constructor.name];
            console.log(this.stats);
        }

        this.loadMinigame();
    }

    /**
     * loadMinigame() charge le minijeu à l'écran
     */
    async loadMinigame() {
        this.dataManager.canInterract = false;
        this.uiRenderer.getElement('playground').innerHTML = await this.uiController.requestManager.getMinigameUI(this.constructor.name);
        document.querySelector('.minigame').addEventListener('click', (ev) => this.minigameHandler(ev));
    }


    /**
     * exitMinigame() gère la fermeture du minijeu et transporte le joueur au prochain evenement / playground
     */
    exitMinigame() {
        if (this.eventHandler[`${this.exitState}Event`]) {
            this.eventHandler[`${this.exitState}Event`]();
        } else {
            this.eventHandler.setupPlayground(this.exitState);
        }
        this.uiController.dataManager.save.minigameStats[this.constructor.name] = this.stats;
        this.uiController.dataManager.saveData();
        setTimeout(() => {
            this.dataManager.canInterract = true;
        }, 600);
    }
}