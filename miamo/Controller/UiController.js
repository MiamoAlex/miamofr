import * as Miamo from '../index.js'

export class UiController {
    domElements = {
        body: {
            element: 'body',
            events: ['keydown', 'click']
        },

        audioSlider: {
            element: '.header__sound',
            events: ['input']
        },

        main: {
            element: '.main'
        },

        playground: {
            element: '.main__playground',
            events: ['mousemove']
        }
    }

    cursorPosition = {
        x: 0,
        y: 0
    };

    constructor(dataManager, uiRenderer) {
        this.dataManager = dataManager;
        this.uiRenderer = uiRenderer;
        this.audioManager = new Miamo.AudioManager();
        this.requestManager = new Miamo.RequestManager();
        this.eventHandler = new Miamo.EventHandlerCH1(this);

        this.uiRenderer.appendDomElements(this.domElements);
        for (const key in this.domElements) {
            const domElement = this.domElements[key];
            if (domElement.events) {
                domElement.events.forEach(event => {
                    if (this[`${key}Handler`]) {
                        this.uiRenderer.getElement(key).addEventListener(event, (ev) => this[`${key}Handler`](ev));
                    }
                });
            }
        }

        console.log('%cbienvenue sur miamo.fr 👓', 'font-size:2rem;color:aquamarine');
        console.log('%csi tu es un pirate 🦜 alors pars rapidement car ici on ne rigole pas avec les pirates !!!! on a la bébé police avec nous alors attention', 'font-size:1rem;color:pink; font-weight:bold');
        console.log('%cburger', 'font-size:.4rem;color:aquamarine');

        // Fonction callback à éxécuter quand une mutation est observée
        var callback = (mutationsList) => {
            for (var mutation of mutationsList) {
                if (this.dataManager.canInterract && (mutation.type === "attributes" || mutation.type === "childList") && mutation.attributeName !== 'style') {
                    this.eventHandler.triggerEvent('antiPiracy');      
                    return
                }
            }
        };

        // Créé une instance de l'observateur lié à la fonction de callback
        this.observer = new MutationObserver(callback);
        this.observer.observe(this.uiRenderer.getElement('playground'), { attributes: true, childList: true, subtree: true });
    }

    /**
     * Déplacement de la caméra dans le monde
     * @param {Event} ev 
     */
    playgroundHandler(ev) {
        const rect = ev.currentTarget.getBoundingClientRect();
        this.cursorPosition = {
            x: ev.clientX - rect.left,
            y: ev.clientY - rect.top
        }
        const playground = ev.currentTarget.children[0];
        if (playground && playground.classList[0] == 'playground__content') {
            playground.style.transform = `translate(${-this.cursorPosition.x / 1064 * 30}%, ${-this.cursorPosition.y / 1080 * 50}%)`
        }
    }

    /**
     * audioSliderHandler() gère le volume
     * @param {Event} ev Evenement au clic sur l'input
     */
    audioSliderHandler(ev) {
        this.audioManager.volume = ev.target.value;
        this.audioManager.currentSounds.forEach(audio => {
            audio.volume = this.audioManager.volume;
        });
    }

    /**
     * bodyHandler() s'occupe de gérer les sons rigolos quand tu appuies sur le clavier
     * @param {Event} ev Appui d'une touche sur le clavier 
     */
    bodyHandler(ev) {
        switch (ev.type) {
            case 'click':
                this.audioManager.loadAudioFile('click', 'sfx');
                if (this.dataManager.canInterract) {
                    const dataset = ev.target.dataset;
                    if (dataset.playground) {
                        this.eventHandler.setupPlayground(dataset.playground);
                    }

                    if (dataset.event) {
                        this.eventHandler.triggerEvent(dataset.event, ev);
                    } 
                    
                    if (dataset.voiceline) {
                        this.audioManager.loadAudioFile(dataset.voiceline, 'voiceline')
                    } 
                    
                    if (dataset.sfx) {
                        this.audioManager.loadAudioFile(dataset.sfx, 'sfx')
                    }
                }
                break;

            case 'keydown':
                if (/^[a-zA-Z0-9_.-]*$/.test(ev.key) && ev.key.length === 1) {
                    this.audioManager.loadAudioFile(ev.key, 'keys');
                }
                break;
        }
    }
}