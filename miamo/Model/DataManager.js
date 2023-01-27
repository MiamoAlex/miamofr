export class DataManager {
    canInterract = true;
    currentState = 'miamoIntro';
    playMode = 'playground';

    constructor() {
        if (localStorage.getItem('miamoSave')) {
            this.save = JSON.parse(localStorage.getItem('miamoSave'));
            // Conversion des vielles sauvegardes
            if (!this.save.storyAdvancement || !this.save.volume) {
                this.save = {};
                localStorage.clear();
                document.location.reload();
            }
        } else {
            this.save = {
                state: "miamoIntro",
                sandwiches: [],
                tools: [],
                discoveries: [],
                achievements: [],
                minigameStats: {},
                secrets: {},
                time: 0,
                volume: 0.3,
                storyAdvancement: 0
            }
        }
    }

    /**
     * Mise à jour de l'avancée de l'histoire
     * @param {Number} advancement 
     */
    setStoryAdvancement(advancement) {
        this.save.storyAdvancement = advancement;
    }

    /**
     * getStoryAdvancement() retourne l'avancée de l'histoire
     * @returns {Number}
     */
    getStoryAdvancement() {
        return this.save.storyAdvancement;
    }

    /**
     * Changement de l'avancement de la partie
     * @param {String} state 
     */
    setMiamoState(state) {
        if (state !== 'worldmap') {
            this.currentState = state;
        }
    }

    /**
     * getMiamoState() retourne l'avancement actuel de la partie
     * @returns {String}
     */
    getMiamoState() {
        return this.currentState;
    }

    /**
     * Sauvegarde dans le cache de l'avancement de la partie et des données du joueur
     */
    saveData() {
        if (this.currentState !== 'miamoIntro') {
            this.save.state = this.currentState;
        }
        localStorage.setItem('miamoSave', JSON.stringify(this.save));
    }

}