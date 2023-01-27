import * as Miamo from '../index.js'

export class UiController {
    domElements = {
        body: {
            element: 'body',
            events: ['keydown']
        },

        achievements: {
            element: '.main__achievements'
        },

        main: {
            element: '.main',
            events: ['click', 'mousemove', 'touchmove']
        },

        mobilePrompt: {
            element: '.mobileprompt',
            events: ['click']
        },

        menu: {
            element: '.main__menu'
        },

        tools: {
            element: '.main__tools'
        },

        settings: {
            element: '.main__settings',
            events: ['click', 'input']
        },

        audioSlider: {
            element: '.settings__volume-input'
        },

        sandwiches: {
            element: '.main__sandwiches'
        },

        playground: {
            element: '.main__playground',
            events: ['click']
        }
    }

    // Position de la souris
    cursorPosition = {
        x: 0,
        y: 0
    };

    defferedPrompt;

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

        window.addEventListener('beforeinstallprompt', (ev) => {
            ev.preventDefault();
            this.installPromptEvent = ev;
            this.uiRenderer.getElement('settings').children[3].style.display = "block";
            this.uiRenderer.getElement('menu').children[2].style.display = "block";
        });

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

        // Temps écoulé 
        this.startTime = new Date();
        window.addEventListener('beforeunload', () => {
            const endDate = new Date();
            const spentTime = endDate.getTime() - this.startTime.getTime();
            if (this.dataManager.save) {
                this.dataManager.save.time += spentTime;
                this.dataManager.saveData();
            }
        });
    }

    /**
     * updateSandwichesCounter() affiche le nombre de sandwiches collectés
     */
    updateSandwichesCounter() {
        if (this.dataManager.save.sandwiches.length > 9) {
            this.eventHandler.unlockAchievement('sandwichCollector');
        }
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
    }

    /**
     * bodyHandler() s'occupe de gérer les sons rigolos quand tu appuies sur le clavier
     * @param {Event} ev Appui d'une touche sur le clavier 
     */
    bodyHandler(ev) {
        if (/^[a-zA-Z0-9_-]*$/.test(ev.key.toLowerCase()) && ev.key.length === 1) {
            this.audioManager.loadAudioFile(ev.key, 'keys');
        }
    }

    /**
     * mainHandler() gère les clics sur la section des outils du jeu
     * @param {Event} ev Evenement au clic sur les outils 
     */
    mainHandler(ev) {
        if (ev.type == 'mousemove' || ev.type == 'touchmove') {
            const rect = ev.currentTarget.getBoundingClientRect();
            this.cursorPosition = {
                x: Math.min(Math.max((ev.clientX || ev.touches[0].clientX), 0), rect.width) - rect.left,
                y: Math.min(Math.max((ev.clientY || ev.touches[0].clientY), 0), rect.height) - rect.top
            };
            document.documentElement.style.setProperty('--cursorX', -this.cursorPosition.x * 0.5 + 'px');
            document.documentElement.style.setProperty('--cursorY', -this.cursorPosition.y * 0.5 + 'px');
            document.documentElement.style.setProperty('--flashLightX', this.cursorPosition.x - 64 + 'px');
            document.documentElement.style.setProperty('--flashLightY', this.cursorPosition.y + 'px');
        } else {
            switch (ev.target.dataset.tool) {
                // Lunettes
                case 'glasses':
                    if (this.eventHandler.playgroundName === 'worldmap') {
                        this.eventHandler.setupPlayground(this.dataManager.currentState);
                    } else {
                        this.eventHandler.setupPlayground('worldmap');
                    }
                    break;
                // Lampe torche
                case 'flashlight':
                    if (this.eventHandler.currentPlayground.flashlight && this.uiRenderer.getElement('playground').classList[1] == 'playground__dark') {
                        this.dataManager.canInterract = false;
                        this.audioManager.loadAudioFile('flashlightOn', 'sfx');
                        this.uiRenderer.getElement('playground').className = 'main__playground playground__flashlight';
                        setTimeout(() => {
                            this.dataManager.canInterract = true;
                        }, 300);
                    } else if (this.uiRenderer.getElement('playground').classList[1] == 'playground__flashlight') {
                        this.dataManager.canInterract = false;
                        this.audioManager.loadAudioFile('flashlightOff', 'sfx');
                        this.uiRenderer.getElement('playground').className = 'main__playground playground__dark';
                        setTimeout(() => {
                            this.dataManager.canInterract = true;
                        }, 300);
                    }
                    break;
                case 'achievements':
                    if (this.uiRenderer.getElement('achievements').classList[1]) {
                        this.uiRenderer.getElement('achievements').classList.remove('main__achievements-open');
                        this.audioManager.loadAudioFile('closemenu', 'sfx');
                    } else {
                        this.uiRenderer.getElement('achievements').classList.add('main__achievements-open');
                        this.audioManager.loadAudioFile('openmenu', 'sfx');
                        const currentAchievements = [];
                        this.dataManager.save.achievements.forEach(achievement => {
                            currentAchievements.push(this.dataManager.achievements[achievement]);
                        });
                        this.uiRenderer.renderTemplate(document.querySelector('.template__achievement'), currentAchievements, this.uiRenderer.getElement('achievements'));
                    }
                    break;

                case 'settings':
                    this.uiRenderer.getElement('settings').classList.toggle('hide');
                    break;
            }
        }
    }

    settingsHandler(ev) {
        switch (ev.target.className) {
            case 'settings__reset':
                this.eventHandler.triggerEvent('resetSave')
                this.uiRenderer.getElement('settings').classList.add('hide');
                break;

            case 'settings__volume-input':
                this.audioManager.gainNode.gain.value = this.dataManager.save.volume = ev.target.value;
                break;

            case 'mobileprompt__install':
                this.installPromptEvent.prompt();
            break;
        }

    }


    /**
     * mobilePromptHandler() gère les évenements au clic sur la section d'introduction aux appareils mobiles
     * @param {Event} ev Evenement au clic
     */
    async mobilePromptHandler(ev) {
        if (ev.target.className == 'mobileprompt__install') {
            this.installPromptEvent.prompt();
        }
    }
}