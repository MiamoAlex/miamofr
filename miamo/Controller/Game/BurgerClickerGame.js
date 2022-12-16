import { MiniGameController } from "../MiniGameController.js";

export class BurgerClickerGame extends MiniGameController {
    constructor(uiController) {
        super(uiController, 'restaurant');
        setTimeout(() => {
            this.counter = document.querySelector('.burgerclicker__text');
            if (!this.stats) {
                this.stats = {
                    clicks: 0
                }
            }
            this.counter.textContent = this.stats.clicks;
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

            case 'burgerclicker__burger':
                this.stats.clicks++;
                switch (this.stats.clicks) {
                    case 500:
                        this.eventHandler.triggerEvent('rewardburgers');
                        break;
                }
                this.counter.textContent = this.stats.clicks;
                const random = Math.random() * 100;
                if (random > 95) {
                    this.audioManager.loadAudioFile(`burgerclicker-reaction${Math.floor(Math.random() * 6 + 1)}`, 'sfx');
                }
                break;
        }

    }

}