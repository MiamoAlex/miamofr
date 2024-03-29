export class UiRenderer {
    domElements = {};
    templates = {};

    constructor() {
        const templates = document.querySelector('#templates');

        for (let i = 0; i < templates.children.length; i++) {
            const template = templates.children[i];
            this.templates[template.className.split('template__')[1]] = template;
        }
    }

    /**
     * appendDomElements() ajoute aux elements visuels actuels un groupe de nouveau éléments récupérables
     * @param {Object} domElements Objet contenant les différents classes des elements visuels à récuperer 
    */
    appendDomElements(domElements) {
        for (const key in domElements) {
            this.domElements[key] = document.querySelector(domElements[key].element);
        }
    }

    /**
    * getElement() retourne un noeud du DOM à partir de l'id renseigné
    * @param {String} id Identifiant de l'objet 
    * @returns {Node} Noeud demandé
    */
    getElement(id) {
        return this.domElements[id];
    }

    /**
     * renderTools() fait le rendu des outils du joueur sur le menu des outils
     * @param {Array<String>} tools Outils du joueur
     */
    renderTools(tools) {
        this.getElement('tools').innerHTML = '';
        this.getElement('tools').classList.remove('hide');
        this.getElement('menu').classList.remove('hide');
        tools.forEach(tool => {
            this.getElement('tools').innerHTML += `<img src="./assets/tex/${tool}.png" alt="lunettes magiques" class="tools__${tool}" data-tool="${tool}">`
        });
    }

    /**
     * renderTemplate() formatte une template à partir d'un tableau d'objet et l'envoie dans le dom destination
     * @param {Node} template 
     * @param {Array<Object>} arrayObj 
     * @param {Node} destination 
     */
    renderTemplate(template, arrayObj, destination) {
        const toFormat = Array.from(template.innerHTML.matchAll(/{{(.*?)}}/gi));
        let formattedTemplates = '';
        for (let i = 0; i < arrayObj.length; i++) {
            const obj = arrayObj[i];
            formattedTemplates += template.innerHTML;
            for (let j = 0; j < toFormat.length; j++) {
                const tag = toFormat[j][0];
                const key = toFormat[j][1];
                if (obj[key]) {
                    formattedTemplates = formattedTemplates.replaceAll(tag, obj[key]);
                } else {
                    formattedTemplates = formattedTemplates.replaceAll(tag, '');
                }
            }
        }
        // Retour des données
        if (destination) {
            destination.innerHTML = formattedTemplates;
        } else {
            return formattedTemplates;
        }
    }

    /**
     * createImage() génére une image avec certains parametres à l'écran
     * @param {Node} destination Destinatino de l'image
     * @param {String} src Nom de l'image pour remplir l'url
     * @param {String} className Classe css à donner à l'image
     * @param {boolean} clear Faut-il nettoyer l'écran (propre)
     * @param {Event} event Dataset à remplir sur l'image qui doit déclencher un evenement
     * @returns 
     */
    createImage(destination, src, className, clear, event, playground) {
        if (clear) {
            this.getElement('playground').innerHTML = '';
        }
        const img = document.createElement('img');
        img.src = `./assets/tex/${src}.png`;
        img.className = className;
        if (event) {
            img.dataset.event = event;
        }
        if (playground) {
            img.dataset.playground = playground;
        }
        this.getElement(destination).appendChild(img);
        return img;
    }

    renderAchievement(achievementObj) {
        const achievement = this.renderTemplate(document.querySelector('.template__achievement'), achievementObj);
        this.getElement('main').insertAdjacentHTML('afterbegin', achievement);

        setTimeout(() => {
            document.querySelector('.achievement').remove();
        }, 4000);
    }

    /**
     * Chargement d'un nouveau playgorund à l'écran 
     * @param {String} playground Contenu html du playground
     */
    loadPlayground(playground, sandwiches, playerSandwiches) {
        this.getElement('playground').style.filter = 'brightness(0)';
        // Après l'animation, création du playground
        setTimeout(() => {
            this.getElement('playground').innerHTML = playground;
            const playergroundContent = document.querySelector('.playground__content');
            playergroundContent.style.backgroundImage = `url(../../assets/backgrounds/${playergroundContent.dataset.background}.webp)`
            this.getElement('playground').style.filter = 'brightness(1)';
            // Création des sandwiches
            if (sandwiches) {
                sandwiches.forEach(sandwich => {
                    if (!playerSandwiches.includes(sandwich)) {
                        playergroundContent.innerHTML += `<img src="../assets/tex/sandwich.gif" alt="mmmhmmhmhh h l e bon sandwiiiich" class="sandwich sandwich__${sandwich}" data-sandwich="${sandwich}">`;
                    }
                });
            }
        }, 300);
    }
}