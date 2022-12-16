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

        sandwiches: {
            element: '.main__sandwiches'
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

    constructor(dataManager, uiRenderer, window) {
        this.window = window;
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

        // Chargement du volume sonore
        if (this.dataManager.save.volume) {
            this.uiRenderer.getElement('audioSlider').value = this.audioManager.volume = this.dataManager.save.volume;
        }

        console.log('%cbienvenue sur miamo.fr 👓', 'font-size:2rem;color:aquamarine');
        console.log('%csi tu es un pirate 🦜 alors pars rapidement car ici on ne rigole pas avec les pirates !!!! on a la bébé police avec nous alors attention', 'font-size:1rem;color:pink; font-weight:bold');
        console.log('%cburger', 'font-size:.4rem;color:aquamarine');

        // Fonction callback à éxécuter quand une mutation est observée
        var callback = (mutationsList) => {
            for (var mutation of mutationsList) {
                if (this.dataManager.canInterract === true && (mutation.type === "attributes" || mutation.type === "childList") && mutation.attributeName !== 'style') {
                    this.eventHandler.triggerEvent('antiPiracy');
                    return
                }
            }
        };

        // Créé une instance de l'observateur lié à la fonction de callback
        this.observer = new MutationObserver(callback);
        this.observer.observe(this.uiRenderer.getElement('playground'), { attributes: true, childList: true, subtree: true, attributeFilter: ['data-event', 'data-sandwich', 'data-playground', 'data-minigame', 'class'] });
    }

    /**
     * updateSandwichesCounter() affiche le nombre de sandwiches collectés
     */
    updateSandwichesCounter() {
        this.uiRenderer.getElement('sandwiches').classList.remove('hide');
        this.uiRenderer.getElement('sandwiches').children[1].textContent = this.dataManager.save.sandwiches.length;
        setTimeout(() => {
            this.uiRenderer.getElement('sandwiches').classList.add('hide');
        }, 3500);
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
        this.audioManager.volume = this.dataManager.save.volume = ev.target.value;
        this.dataManager.saveData();
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
                if (this.dataManager.canInterract && this.dataManager.playMode === 'playground') {
                    const dataset = ev.target.dataset;
                    // L'objet cliqué ouvre un nouveau playground
                    if (dataset.playground) {
                        this.eventHandler.setupPlayground(dataset.playground);
                    }
                    // L'objet cliqué ouvre un nouvel event
                    if (dataset.event) {
                        this.eventHandler.triggerEvent(dataset.event, ev);
                    }
                    // L'objet cliqué lance une nouvelle voiceline
                    if (dataset.voiceline) {
                        this.audioManager.loadAudioFile(dataset.voiceline, 'voiceline')
                    }
                    // L'objet cliqué fait un son
                    if (dataset.sfx) {
                        this.audioManager.loadAudioFile(dataset.sfx, 'sfx')
                    }
                    // L'objet cliqué ouvre un minijeu
                    if (dataset.minigame) {
                        this.eventHandler.miniGameController = new Miamo[dataset.minigame](this);
                    }
                    // L'objet cliqué ajoute un sandwich
                    if (dataset.sandwich) {
                        this.dataManager.canInterract = false;
                        this.audioManager.loadAudioFile('eating', 'sfx');
                        if (this.dataManager.save.sandwiches) {
                            this.dataManager.save.sandwiches.push(parseInt(dataset.sandwich));
                        } else {
                            this.dataManager.save.sandwiches = [parseInt(dataset.sandwich)];
                        }
                        this.updateSandwichesCounter();
                        ev.target.remove();
                        setTimeout(() => {
                            this.dataManager.canInterract = true;
                        }, 300);
                    }
                }
                break;

            case 'keydown':
                if (/^[a-zA-Z0-9_.-]*$/.test(ev.key.toLowerCase()) && ev.key.length === 1) {
                    this.audioManager.loadAudioFile(ev.key, 'keys');
                }
                break;
        }
    }
}