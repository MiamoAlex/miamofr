export class EventHandler {
    constructor(uiController) {
        this.uiController = uiController;
        this.uiRenderer = this.uiController.uiRenderer;
        this.audioManager = this.uiController.audioManager;
        this.dataManager = this.uiController.dataManager;
        this.requestManager = this.uiController.requestManager;
    }

    /**
     * triggerEvent enclenche un evenement de l'histoire
     * @param {Event} event Evenement à enclencher
     * @param {*} ev Eventuel evenement js
     */
    triggerEvent(event, ev) {
        this[`${event}Event`](ev);
        if (event !== 'intro') {
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
        this.dataManager.canInterract = false;
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        }

        ev.target.classList.add('main__h1-anim')
        this.audioManager.loadAudioFile('intro', 'sfx', [
            // le logo devient .fr
            {
                progress: 80, callback: () => {
                    ev.target.textContent = '.fr';
                }
            },
            // chargement de la sauvegarde ou début de la partie
            {
                progress: 95, callback: () => {
                    if (this.dataManager.save.state !== 'intro') {
                        this.dataManager.canInterract = true;
                        this.dataManager.setMiamoState(this.dataManager.save.state);
                        this.triggerEvent(this.dataManager.getMiamoState());
                    } else {
                        this.triggerEvent('miamoIntro');
                    }
                }
            }
        ]);
    }

}