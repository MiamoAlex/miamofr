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
                }
            },
            {
                progress: 90, callback: () => {
                    this.dataManager.canInterract = true;
                }
            }
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
                        this.timedEvent = setTimeout(() => {
                            this.triggerEvent('eglantineEatsBurgers');
                        }, 10000);
                    }
                },
                {
                    progress: 85, callback: () => {
                        this.dataManager.canInterract = true;
                    }
                }
            ]);
        }, 1000);
    }

    eglantineEvent() {
        clearTimeout(this.timedEvent);
        this.audioManager.loadAudioFile('eglantinedeath', 'sfx');
        this.uiRenderer.createImage('playground', 'burgers', 'main__burgers', true);
        this.audioManager.loadAudioFile('hector', 'voiceline', [
            {
                // un hector sauvage apparait (pas pokemon hein l'oiseau)
                progress: 50, callback: () => {
                    this.uiRenderer.createImage('playground', 'hector', 'main__hector', false, 'hector');
                }
            },
            {
                progress: 55, callback: () => {
                    this.dataManager.canInterract = true;
                    this.timedEvent = setTimeout(() => {
                        this.triggerEvent('hectorEatsBurgers');
                    }, 6000);
                }
            }
        ]);
    }

    eglantineEatsBurgersEvent() {
        this.audioManager.loadAudioFile('eglantineEatsBurgers', 'voiceline', [
            {
                progress: 1, callback: () => {
                    this.uiRenderer.getElement('playground').innerHTML = '';
                }
            },
            {
                progress: 30, callback: () => {
                    this.uiRenderer.createImage('playground', 'fateglantine', 'main__elleestenorme', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.triggerEvent('introEnd');
                }
            }
        ]);
    }

    hectorEatsBurgersEvent() {
        this.audioManager.loadAudioFile('hectordeathburgers', 'voiceline', [
            {
                progress: 1, callback: () => {
                    this.uiRenderer.getElement('playground').innerHTML = '';
                }
            },
            {
                progress: 80, callback: () => {
                    this.uiRenderer.createImage('playground', 'hectordeath', 'main__ohnonhectorestmortputaintroptriste', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.triggerEvent('introEnd');
                }
            }
        ]);
    }

    hectorEvent() {
        clearTimeout(this.timedEvent);
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
        this.uiRenderer.getElement('playground').innerHTML = '';
        this.audioManager.loadAudioFile('introEnd', 'voiceline', [
            {
                progress: 80, callback: () => {
                    this.uiRenderer.createImage('playground', 'door', 'main__portemagique', true, "", 'restaurant');
                }
            },
            {
                progress: 85, callback: () => {
                    this.dataManager.canInterract = true;
                }
            }
        ]);
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
                    this.setupPlayground('placeholder', 'ohnon');
                }
            }
        ]);

    }
}