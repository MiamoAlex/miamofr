import { EventHandler } from "./EventHandler.js";

export class EventHandlerCH1 extends EventHandler {
    constructor(uiController) {
        super(uiController);
    }

    miamoIntroEvent() {
        // superbe image de personne souriant 😅😅😅😅
        this.uiRenderer.createImage('playground', 'rire', 'main__happy', true);
        this.audioManager.loadAudioFile('welcome', 'voiceline', [
            // Apparition du doggy chien
            {
                progress: 20, callback: () => {
                    this.uiRenderer.createImage('playground', 'chien', 'main__doggychien', true);
                }
            },
            // hamburger moment 🍔
            {
                progress: 85, callback: () => {
                    this.uiRenderer.createImage('playground', 'burger', 'main__burger', true, 'burger');
                    this.dataManager.canInterract = true;
                }
            },
        ]);
    }

    burgerEvent() {
        this.uiRenderer.getElement('playground').innerHTML = '';
        this.audioManager.loadAudioFile('eating', 'sfx');

        setTimeout(() => {
            this.audioManager.loadAudioFile('eglantine', 'voiceline', [
                // apparition de églantine (souris gentille mais danger !!!!!)
                {
                    progress: 20, callback: () => {
                        this.eglantine = this.uiRenderer.createImage('playground', 'eglantine', 'main__eglantine', false);
                        this.interval = setInterval(() => {
                            const img = this.uiRenderer.createImage('playground', 'alerte', 'main__alert', false);
                            img.style.top = `calc(${Math.random() * 100}vh`;
                            img.style.right = `calc(${Math.random() * 100}vw`;
                        }, 400);
                    }
                },
                // Eglantine devient folle et s'enfuie avec les hamburgers
                {
                    progress: 80, callback: () => {
                        this.eglantine.classList.add('main__eglantine-run');
                        this.eglantine.dataset.event = 'eglantine';
                        this.eglantine.src = './assets/tex/eglantineburgz.png';
                        clearInterval(this.interval);
                    }
                }
            ]);
        }, 1000);
    }

    eglantineEvent() {
        this.audioManager.loadAudioFile('eglantinedeath', 'sfx');
        this.uiRenderer.createImage('playground', 'burgers', 'main__burgers', true);
        this.audioManager.loadAudioFile('hector', 'voiceline', [{
            // un hector sauvage apparait (pas pokemon hein l'oiseau)
            progress: 50, callback: () => {
                this.uiRenderer.createImage('playground', 'hector', 'main__hector', false, 'hector');
            }
        }]);
    }

    hectorEvent() {
        this.uiRenderer.createImage('playground', 'burgers', 'main__burgers', true);
        this.audioManager.loadAudioFile('hectordeath', 'voiceline', [{
            // chat 🐱
            progress: 65, callback: () => {
                this.uiRenderer.createImage('playground', 'hectordeath', 'main__ohnonhectorestmortputaintroptriste', true);
            }
        },

        {
            progress: 99, callback: () => {
                this.uiRenderer.getElement('playground').innerHTML = '';
                this.triggerEvent('introEnd');
            }
        }
        ]);
    }

    introEndEvent() {
        this.audioManager.loadAudioFile('introEnd', 'voiceline', [
            {
                progress: 80, callback: () => {
                    this.uiRenderer.createImage('playground', 'door', 'main__portemagique', true, 'restaurant');
                }
            }
        ]);
    }

    async restaurantEvent() {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('restaurant'), this.uiController.cursorPosition);
        this.audioManager.loadAudioFile('ohnon', 'music');
    }

    async backroomEvent() {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('backroom'), this.uiController.cursorPosition);
        this.audioManager.loadAudioFile('backroom', 'music');
    }

    async kitchenEvent() {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('kitchen'), this.uiController.cursorPosition);
        this.audioManager.loadAudioFile('angel', 'music');
    }

    recipeEvent() {
        this.uiRenderer.createImage('playground', 'recipe', 'main__recetteprevcieuse', true);
        this.audioManager.loadAudioFile('plottwist1', 'voiceline', [
            {
                progress: 35, callback: () => {
                    this.uiRenderer.createImage('playground', 'mechant', 'main__ohlevilainsorcier', true);
                }
            },
            {
                progress: 56, callback: () => {
                    this.uiRenderer.createImage('playground', 'triste', 'main__OHNONCHORRIBLELARECETTEMIAMOBURGER', true);
                }
            },
            {
                progress: 83, callback: () => {
                    this.uiRenderer.createImage('playground', 'mechant', 'main__ohlevilainsorcier', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.triggerEvent('placeholderEnding');
                }
            }
        ]);

    }
    /**
     * placeholderEndingEvent()
     */
    async placeholderEndingEvent() {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('placeholder'), this.uiController.cursorPosition);
        this.audioManager.loadAudioFile('ohnon', 'music');
    }
}