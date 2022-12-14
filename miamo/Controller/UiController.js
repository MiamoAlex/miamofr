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
        }
    }

    constructor(dataManager, uiRenderer, audioManager, eventHandler) {
        this.dataManager = dataManager;
        this.uiRenderer = uiRenderer;
        this.audioManager = audioManager;
        this.eventHandler = eventHandler;
        // References pour l'eventHandler
        this.eventHandler.uiController = this;
        this.eventHandler.uiRenderer = this.uiRenderer;
        this.eventHandler.audioManager = this.audioManager;
        this.eventHandler.dataManager = this.dataManager;

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
                const state = this.dataManager.getMiamoState();
                if (state !== 'pending') {
                    console.log(state);
                    this[`${state}Handler`](ev);
                    this.dataManager.saveData();
                }
                break;

            case 'keydown':
                if (/^[a-zA-Z0-9_.-]*$/.test(ev.key) && ev.key.length === 1) {
                    this.audioManager.loadAudioFile(`keys/${ev.key}`);
                }
                break;
        }
    }

    /**
     * introEvent() gère les clics sur le coeur de la page pendant l'introduction du site
     * @param {Event} ev Evenement au clic 
     */
    introHandler(ev) {
        if (ev.target.tagName == 'H1') {
            this.dataManager.setMiamoState('PENDING')
            if (document.body.requestFullscreen) {
                document.body.requestFullscreen();
            }

            ev.target.classList.add('main__h1-anim')
            this.audioManager.loadAudioFile('intro');
            setTimeout(() => {
                ev.target.textContent = '.fr';
            }, 8200);

            setTimeout(() => {
                // Check sauvegarde
                if (this.dataManager.save.state !== 'intro') {
                    console.log(this.audioManager.currentSounds[0])
                    this.audioManager.currentSounds[0].pause();
                    this.dataManager.setMiamoState(this.dataManager.save.state);
                    this.eventHandler[`${this.dataManager.getMiamoState()}Event`]();
                } else {
                    this.eventHandler.introEvent();
                }
            }, 10200);
        }
    }
    /**
     * burgerEvent() gère les clics sur le coeur de la page pendant qu'il y a le burger à l'écran
     * @param {Event} ev Evenement au clic 
     */
    burgerHandler(ev) {
        if (ev.target.className === 'main__burger') {
            this.dataManager.setMiamoState('PENDING');
            this.eventHandler.burgerEvent();
            this.dataManager.save.state = 'BURGER';
        }
    }
    /**
     * eglantineHandler() gère les clics sur le coeur de la page pendant qu'il y a eglantine à l'écran
     * @param {Event} ev Evenement au clic 
     */
    eglantineHandler(ev) {
        if (ev.target.classList[1] === 'main__eglantine-run') {
            this.dataManager.setMiamoState('PENDING');
            this.eventHandler.eglantineEvent();
            this.dataManager.save.state = 'EGLANTINE';
        }
    }
    /**
     * hectorHandler() gère les clics sur le coeur de la page pendant qu'il y a hector à l'écran
     * @param {Event} ev Evenement au clic 
     */
    hectorHandler(ev) {
        if (ev.target.className === 'main__hector') {
            this.dataManager.setMiamoState('PENDING');
            this.eventHandler.hectorEvent();
            this.dataManager.save.state = 'HECTOR';
        }
    }


}