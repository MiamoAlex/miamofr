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
}