import { EventHandler } from "./EventHandler.js";

export class EventHandlerCH1 extends EventHandler {
    constructor(uiController) {
        super(uiController);
    }

    /**
     * Bienvenue sur miamo.fr !!!
     */
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

    /**
     * Tu manges le burger et eglantine apparait
     */
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
                    progress: 82, callback: () => {
                        this.dataManager.canInterract = true;
                    }
                }
            ]);
        }, 1000);
    }

    /**
     * Eglantine est repoussée et les burgers sont sauvés?
     */
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

    /**
     * Eglantine absorbe les burgers et devient énorme
     */
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

    /**
     * hector mange tous les burgers et MEURT.
     */
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

    /**
     * tu tues hector (bravo... (il est mort))
     */
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

    /**
     * Fin de l'intro et entrée dans le restaurant
     */
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

    /**
     * tu as cliqué sur mamie
     */
    grandmaEvent() {
        this.currentCountEvent++;
        const grandma = this.uiRenderer.createImage('playground', 'grandma', 'GRAND MAMIE', true, "");
        let grandmaLine;
        switch (this.currentCountEvent) {
            case 3:
                grandmaLine = 'grandma1';
                break;

            case 5:
                grandmaLine = 'grandma2';
                break;

            case 6:
                grandmaLine = 'grandma3';
                break;

            case 7:
                this.audioManager.loadAudioFile('grandmascreamer', 'voiceline', [
                    {
                        progress: 90, callback: () => {
                            this.dataManager.save.state = 'grandmaending';
                        }
                    },
                    {
                        progress: 83, callback: () => {
                            this.uiRenderer.createImage('playground', 'killergrandma', 't mort', true, "");
                            setTimeout(() => {
                                this.triggerEvent('grandmaEnding');
                            }, 200);
                        }
                    }
                ]);
                break;

            default:
                grandmaLine = 'grandmabreath';
                break;
        }
        if (this.currentCountEvent < 7) {
            grandma.style.transform = `scale(${1 + this.currentCountEvent / 8})`;
            this.audioManager.loadAudioFile(grandmaLine, 'voiceline', [
                {
                    progress: 99, callback: () => {
                        this.setupPlayground('restaurant');
                    }
                }
            ]);
        }
    }

    /**
     * meilleur mangeur burger 2023
     */
    rewardburgersEvent() {
        this.uiRenderer.createImage('playground', 'eglantine', 'bravoooo !!', true, "");
        this.audioManager.loadAudioFile('rewardburgers', 'voiceline', [
            {
                progress: 99, callback: () => {
                    this.setupPlayground('restaurant');
                }
            }
        ]);
    }

    // fin grand mère..
    grandmaEndingEvent() {
        this.uiRenderer.createImage('playground', 'triste', 'ooh nonn snifff', true, "");
        this.audioManager.loadAudioFile('grandmaEnding', 'voiceline', [
            {
                progress: 78, callback: () => {
                    this.uiRenderer.getElement('playground').innerHTML = 'fin grand-mère';
                }
            },
            {
                progress: 99, callback: () => {
                    this.setupPlayground('restaurant');
                }
            }
        ]);
    }

    /**
     * un sorcier maléfique vient nous voler la recette !!!!!!!!!!!!
     */
    recipeEvent() {
        this.uiRenderer.createImage('playground', 'recipe', 'main__recetteprevcieuse', true);
        this.audioManager.loadAudioFile('plottwist1', 'voiceline', [
            {
                progress: 33, callback: () => {
                    this.uiRenderer.createImage('playground', 'mechant', 'main__ohlevilainsorcier', true);
                }
            },
            {
                progress: 56, callback: () => {
                    this.uiRenderer.createImage('playground', 'triste', 'main__OHNONCHORRIBLELARECETTEMIAMOBURGER', true);
                }
            },
            {
                progress: 78, callback: () => {
                    this.uiRenderer.createImage('playground', 'mechant', 'main__ohlevilainsorcier', true);
                }
            },
            {
                progress: 87, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantine', 'SAUVE NOUS EGLANTINE', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.dataManager.save.storyAdvancement = 2;
                    this.setupPlayground('mageforest', 'forestambient');
                }
            }
        ]);
    }

    kitchenCheck() {
        console.log(this.dataManager.save.storyAdvancement)
        if (this.dataManager.save.storyAdvancement > 1) {
            document.querySelector('.kitchen__recipe').remove();
        }
    }

    worldmapCheck() {
        this.dataManager.save.discoveries.forEach(discovery => {
            document.querySelector('.playground__content').innerHTML += `<img class="worldmap__${discovery}" src="./assets/tex/${discovery}.png" data-playground="${discovery}">`;
        });
    }

    mageforestCheck() {
        if (this.dataManager.save.storyAdvancement > 2) {
            document.querySelector('.mageforest__eglantine').dataset.voiceline = 'eglantineforestend';
        }
    }

    networksCheck() {
        if (this.dataManager.save.storyAdvancement > 3) {
            document.querySelector('.networks__glasses').remove();
        }
    }

    /**
     * Le développeur étrange rentre en scène et nous envoie dans internet !!!!!!!!!!!!!!!!!
     */
    weirdhousenerdEvent() {
        this.uiRenderer.createImage('playground', 'nerd', 'main__nzodev', true);
        this.audioManager.loadAudioFile('enzo1', 'voiceline', [
            {
                progress: 21, callback: () => {
                    this.uiRenderer.createImage('playground', 'triste', 'main__sniffysnif', true);
                }
            },
            {
                progress: 37, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantine', 'main__eglantine', true);
                }
            },
            {
                progress: 48, callback: () => {
                    this.uiRenderer.createImage('playground', 'hector', 'main__eglantine', true);
                }
            },
            {
                progress: 50, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantine', 'main__eglantine', true);
                }
            },
            {
                progress: 60, callback: () => {
                    this.uiRenderer.createImage('playground', 'nerd', 'grosnerd', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.dataManager.save.storyAdvancement = 3;
                    this.setupPlayground('robots');
                }
            }
        ]);
    }

    /**
     * robotétrange
     */
    robotSpellEvent() {
        this.uiRenderer.createImage('playground', 'grombl', 'ROBOT', true);
        this.audioManager.loadAudioFile('robotspell', 'voiceline', [
            {
                progress: 60, callback: () => {
                    this.uiRenderer.getElement('playground').innerHTML += '<input class="robotspell" type="text">';

                    setTimeout(() => {
                        const input = document.querySelector('.robotspell');
                        console.log(input.value)
                        if (input.value.toLowerCase() == 'grombluchoire') {
                            this.triggerEvent('robotSpellSucess');
                        } else {
                            this.triggerEvent('robotSpellFailed');
                        }
                    }, 7500);
                }
            }
        ]);
    }

    robotSpellFailedEvent() {
        this.uiRenderer.createImage('playground', 'grombl', 'ROBOT PAS BRAVO', true);
        this.audioManager.loadAudioFile('robotspellfailed', 'voiceline', [
            {
                progress: 45, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantinebomb', 'euh églantine ça va?', true);
                }
            },
            {
                progress: 65, callback: () => {
                    this.uiRenderer.createImage('playground', 'boom', 'oula non ça va pas', true);
                }
            },
            {
                progress: 80, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantine', 'super eglantine a super fait exploser le robot', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.setupPlayground('rainbowtunnel');
                }
            }
        ]);
    }

    robotSpellSucessEvent() {
        this.uiRenderer.createImage('playground', 'grombl', 'ROBOT BRAVO', true);
        this.audioManager.loadAudioFile('robotspellsuccess', 'voiceline', [
            {
                progress: 99, callback: () => {
                    this.setupPlayground('rainbowtunnel');
                }
            }
        ]);
    }

    /**
     * on a trouvé des lunettes !!!!!
     */
    glassesfoundEvent() {
        this.dataManager.save.storyAdvancement = 4;
        this.uiRenderer.createImage('playground', 'glasses', 'lunete', true);

        this.audioManager.loadAudioFile('glassesfound', 'voiceline', [
            {
                progress: 23, callback: () => {
                    this.uiRenderer.createImage('playground', 'robot', 'roboto', true);
                }
            },
            {
                progress: 73, callback: () => {
                    this.uiRenderer.createImage('playground', 'rire', 'TROP CONTENT !!', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.dataManager.save.tools.push('glasses');
                    this.uiRenderer.renderTools(this.dataManager.save.tools);
                    this.setupPlayground('networks');
                }
            }
        ]);
    }
}