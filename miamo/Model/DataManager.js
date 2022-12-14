export class DataManager {
    MIAMOSTATES = {
        PENDING: 'pending',
        INTRO: 'intro',
        BURGER: 'burger',
        EGLANTINE: 'eglantine',
        HECTOR: 'hector'
    }

    currentState = this.MIAMOSTATES.INTRO;

    /**
     * Changement de l'avancement de la partie
     * @param {String} state 
     */
    setMiamoState(state) {
        this.currentState = this.MIAMOSTATES[state];
    }

    /**
     * getMiamoState() retourne l'avancement actuel de la partie
     * @returns {String}
     */
    getMiamoState() {
        return this.currentState;
    }
    
}