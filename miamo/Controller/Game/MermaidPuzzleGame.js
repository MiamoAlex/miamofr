import { MiniGameController } from "../MiniGameController.js";

export class MermaidPuzzleGame extends MiniGameController {
    constructor(uiController) {
        super(uiController, 'underlake');
        setTimeout(() => {
            this.counter = document.querySelector('.burgerclicker__text');
            if (!this.stats) {
                this.stats = {}
            }
            this.combinaison = []
        }, 300);
    }


    /**
     * minigameHandler() gère les clics sur le minijeu
     * @param {Event} ev Evenement au clic sur le burger
     */
    minigameHandler(ev) {
        switch (ev.target.className) {
            case 'minigame__close':
                this.exitMinigame();
                break;

            case 'mermaidpuzzle__note':
                clearTimeout(this.reset);
                const note = ev.target.dataset.note;
                this.audioManager.loadAudioFile(`note${note}`, 'sfx');
                this.combinaison.push(note);
                this.reset = setTimeout(() => {
                    this.combinaison = [];
                }, 1500);

                if (this.combinaison.toString() == ['6', '6', '5', '6', '4', '3'].toString()) {
                    this.eventHandler.triggerEvent('mermaidWorld')
                }
                break;
        }

    }

}