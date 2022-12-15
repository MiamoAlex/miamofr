export class RequestManager {
    
    /**
     * getPlayground récupère un fichier 
     * @param {String} playgroundName 
     */
    async getPlayground(playgroundName) {
        const req = await fetch(`./playgrounds/${playgroundName}.html`);
        return await req.text();
    }
}