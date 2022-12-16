export class EventHandler {
    constructor(uiController) {
        this.uiController = uiController;
        this.uiRenderer = this.uiController.uiRenderer;
        this.audioManager = this.uiController.audioManager;
        this.dataManager = this.uiController.dataManager;
        this.requestManager = this.uiController.requestManager;
    }

    currentCountEvent = 0;
    lastEvent = '';
    /**
     * triggerEvent enclenche un evenement de l'histoire
     * @param {Event} event Evenement à enclencher
     * @param {*} ev Eventuel evenement js
     */
    triggerEvent(event, ev) {
        this.dataManager.canInterract = false;
        this.dataManager.playMode = 'playground';
        this[`${event}Event`](ev);
        if (this.lastEvent !== event) {
            this.lastEvent = event;
            this.currentCountEvent = 0;
        }
        if (event !== 'intro' && event !== 'antiPiracy') {
            this.dataManager.setMiamoState(event);
            this.dataManager.saveData();
            if (this.audioManager.currentMusic) {
                this.audioManager.currentMusic.pause();
            }
        }
    };

    /**
     * introEvent() gère l'animatino du lancement de la page et la suite
     * @param {Evenement au clic} ev Clic sur miamo.fr 
     */
    introEvent(ev) {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        }

        ev.target.classList.add('main__h1-anim')
        this.audioManager.loadAudioFile('intro', 'voiceline', [
            // le logo devient .fr
            {
                progress: 80, callback: () => {
                    ev.target.textContent = '.fr';
                }
            },
            // chargement de la sauvegarde ou début de la partie
            {
                progress: 95, callback: () => {
                    this.dataManager.setMiamoState(this.dataManager.save.state);
                    if (this[`${this.dataManager.getMiamoState()}Event`]) {
                        this.triggerEvent(this.dataManager.getMiamoState());
                    } else {
                        this.setupPlayground(this.dataManager.getMiamoState());
                    }
                }
            }
        ]);
    }

    /**
     * antiPiracyEvent fait apparaitre un gros bébé énervé contre les méchants pirates
     */
    antiPiracyEvent() {
        this.audioManager.loadAudioFile('antipiracy', 'voiceline', [
            {
                progress: 1, callback: () => {
                    this.uiRenderer.createImage('playground', 'antipiracy', 'main__bebz', true, 'miamoIntro');
                    this.uiRenderer.getElement('playground').append('écran sécurité anti pirate !! ! !! ! ! !!! bébé police')
                }
            },
            {
                progress: 95, callback: () => {
                    this.dataManager.setMiamoState(this.dataManager.save.state);
                    if (this[`${this.dataManager.getMiamoState()}Event`]) {
                        this.triggerEvent(this.dataManager.getMiamoState());
                    } else {
                        this.setupPlayground(this.dataManager.getMiamoState());
                    }
                }
            }
        ]);
    }

    /**
     * Evenement général de génération des playgrounds
     * @param {String} playgroundName 
     */
    async setupPlayground(playgroundName) {
        this.dataManager.canInterract = false;
        this.dataManager.playMode = 'playground';
        const playgroundData = this.playgroundModels[playgroundName];
        if (playgroundData.music) {
            this.audioManager.loadAudioFile(playgroundData.music, 'music');
        }
        this.dataManager.setMiamoState(playgroundName);
        this.dataManager.saveData();
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground(playgroundName), this.uiController.cursorPosition, playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            this.dataManager.canInterract = true;
        }, 600);
    }

}