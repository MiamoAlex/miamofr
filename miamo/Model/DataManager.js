export class DataManager {
    canInterract = true;
    currentState = 'miamoIntro';

    constructor() {
        if (localStorage.getItem('miamoSave')) {
            this.save = JSON.parse(localStorage.getItem('miamoSave'));
            if (!this.save.sandwiches) {
                this.save.sandwiches = []
            }
        } else {
            this.save = {
                state: "miamoIntro",
                sandwiches: []
            }
        }
    }

    /**
     * Changement de l'avancement de la partie
     * @param {String} state 
     */
    setMiamoState(state) {
        this.currentState = state;
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
        this.save.state = this.currentState;
        localStorage.setItem('miamoSave', JSON.stringify(this.save));
    }
    
}