export class UiController {
    domElements = {
        body: {
            element: 'body',
            events: ['keydown']
        },

        audioSlider: {
            element: '.header__sound',
            events: ['input']
        },

        main: {
            element: '.main',
            events: ['click']
        }
    }

    constructor(dataManager, uiRenderer, audioManager) {
        this.dataManager = dataManager;
        this.uiRenderer = uiRenderer;
        this.audioManager = audioManager;

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
    }

    /**
     * bodyHandler() s'occupe de gérer les sons rigolos quand tu appuies sur le clavier
     * @param {Event} ev Appui d'une touche sur le clavier 
     */
    bodyHandler(ev) {
        if (/^[a-zA-Z0-9_.-]*$/.test(ev.key) && ev.key.length === 1) {
            this.audioManager.loadAudioFile(`keys/${ev.key}`);
        }
    }

    /**
     * mainHandler() 
     * @param {Event} ev Evenement au clic sur la section de jeu 
     */
    mainHandler(ev) {
        const state = this.dataManager.getMiamoState()
        if (state !== 'pending') {
            this[`${state}Event`](ev);
        }
    }
    /**
     * introEvent() gère les clics sur le coeur de la page pendant l'introduction du site
     * @param {Event} ev Evenement au clic 
     */
    introEvent(ev) {
        if (ev.target.tagName == 'H1') {
            document.body.requestFullscreen();
            ev.target.classList.add('main__h1-anim')
            this.dataManager.setMiamoState('PENDING')
            this.audioManager.loadAudioFile('intro');
            setTimeout(() => {
                this.uiRenderer.createImage('main', 'rire', 'main__happy', true);
                setTimeout(() => {
                    this.uiRenderer.createImage('main', 'chien', 'main__doggychien', true);
                    setTimeout(() => {
                        this.uiRenderer.createImage('main', 'burger', 'main__burger', true);
                        this.dataManager.setMiamoState('BURGER')
                    }, 5000);
                }, 2000);
            }, 10500);
        }
    }
    /**
     * burgerEvent() gère les clics sur le coeur de la page pendant qu'il y a le burger à l'écran
     * @param {Event} ev Evenement au clic 
     */
    burgerEvent(ev) {
        if (ev.target.className === 'main__burger') {
            this.dataManager.setMiamoState('PENDING')
            this.uiRenderer.getElement('main').innerHTML = '';
            this.audioManager.loadAudioFile('eating');
            setTimeout(() => {
                this.audioManager.loadAudioFile('eglantine');
                setTimeout(() => {
                    const eglantine = this.uiRenderer.createImage('main', 'eglantine', 'main__eglantine', false);
                    setTimeout(() => {
                        const interval = setInterval(() => {
                            const img = this.uiRenderer.createImage('main', 'alerte', 'main__alert', false);
                            img.style.top = `calc(${Math.random() * 100}vh`;
                            img.style.right = `calc(${Math.random() * 100}vw`;
                        }, 400);

                        setTimeout(() => {
                            eglantine.classList.add('main__eglantine-run');
                            eglantine.src = './assets/tex/eglantineburgz.png';
                            clearInterval(interval);
                            this.dataManager.setMiamoState('EGLANTINE')
                        }, 15000);
                    }, 2500);
                }, 6000);
            }, 1000);
        }
    }
    /**
     * eglantineEvent() gère les clics sur le coeur de la page pendant qu'il y a eglantine à l'écran
     * @param {Event} ev Evenement au clic 
     */
    eglantineEvent(ev) {
        if (ev.target.classList[1] === 'main__eglantine-run') {
            this.dataManager.setMiamoState('PENDING')
            this.audioManager.loadAudioFile('eglantinedeath');
            this.uiRenderer.createImage('main', 'burgers', 'main__burgers', true);
            setTimeout(() => {
                this.audioManager.loadAudioFile('hector');
            }, 300);

            setTimeout(() => {
                this.dataManager.setMiamoState('HECTOR')
                this.uiRenderer.createImage('main', 'hector', 'main__hector', false);
            }, 6000);

        }
    }
    /**
     * hectorEvent() gère les clics sur le coeur de la page pendant qu'il y a hector à l'écran
     * @param {Event} ev Evenement au clic 
     */
    hectorEvent(ev) {
        if (ev.target.className === 'main__hector') {
            this.dataManager.setMiamoState('PENDING');
            this.audioManager.loadAudioFile('hectordeath');
            this.uiRenderer.createImage('main', 'burgers', 'main__burgers', true);
            setTimeout(() => {
                this.audioManager.loadAudioFile('chuchotemment');
                this.uiRenderer.createImage('main', 'gustave', 'main__gustave', true);
            }, 11000);
        }
    }


}