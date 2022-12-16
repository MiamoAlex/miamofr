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

        // Fonction callback à éxécuter quand une mutation est observée
        var callback = function (mutationsList) {
            for (var mutation of mutationsList) {
                // console.log(mutation)
            }
        };

        // Créé une instance de l'observateur lié à la fonction de callback
        this.observer = new MutationObserver(callback);
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
                    if (dataset.event) {
                        this.eventHandler.triggerEvent(dataset.event, ev);
                    } else if (dataset.voiceline) {
                        this.audioManager.loadAudioFile(dataset.voiceline, 'voiceline')
                    } else if (dataset.sfx) {
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