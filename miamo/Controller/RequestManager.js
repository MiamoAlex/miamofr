export class RequestManager {
    
    /**
     * getPlayground récupère un fichier 
     * @param {String} playgroundName 
     */
    async getPlayground(playgroundName) {
        const req = await fetch(`./playgrounds/${playgroundName}.html`);
        return await req.text();
    }
    /**
     * getPlaygroundsModel() récupere les infos des maps playgrounds
     * @returns {Object} Modele des playgrounds
     */
    async getPlaygroundModel() {
        const req = await fetch(`./miamo/Model/playgrounds.json`);
        return await req.json();
    }
    /**
     * getMinigameUI() récupère l'interface du minijeu chargé
     * @param {String} game 
     * @returns {String}
     */
    async getMinigameUI(game) {
        const req = await fetch(`./minigames/${game}.html`);
        return await req.text();
    }

    /**
     * getAchievements() récupère tous les succès du jeu
     * @returns {Object} Succès du jeu
     */
    async getAchievements() {
        const req = await fetch('./miamo/Model/achievements.json');
        return await req.json();
    }
}