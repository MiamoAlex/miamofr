import { EventHandler } from "./EventHandler.js";
import * as Miamo from '../index.js'

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
                        }, 18000);
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
                    this.unlockAchievement('eglanmiam');
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
            grandma.style.transform = `scale(${1 + this.currentCountEvent / 3})`;
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

    burgerCheatEvent() {
        this.uiRenderer.createImage('playground', 'antipiracy', 'burger triche', true, "");
        this.uiRenderer.getElement('playground').append('BURGER TRICHEUR BURGER TRICHEUR BURGER TRICHEUR');

        this.audioManager.loadAudioFile('antipiracyminigame', 'voiceline', [
            {
                progress: 99, callback: () => {
                    this.dataManager.save.minigameStats.BurgerClickerGame.clicks = -5000;
                    this.setupPlayground('restaurant');
                }
            }
        ])
    }

    // fin grand mère..
    grandmaEndingEvent() {
        this.uiRenderer.createImage('playground', 'triste', 'ooh nonn snifff', true, "");
        this.audioManager.loadAudioFile('grandmaEnding', 'voiceline', [
            {
                progress: 78, callback: () => {
                    this.uiRenderer.getElement('playground').innerHTML = 'fin grand-mère';
                    this.unlockAchievement('grandmaEnding');
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
                    this.unlockAchievement('recipeStolen');
                    this.setupPlayground('mageforest', 'forestambient');
                }
            }
        ]);
    }

    async kitchenCheck(playgroundData) {
        if (this.dataManager.save.storyAdvancement > 1) {
            this.setupPlayground('firekitchen');
        } else {
            this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('kitchen'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        }
    }

    async worldmapCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('worldmap'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            this.dataManager.save.discoveries.forEach(discovery => {
                document.querySelector('.playground__content').innerHTML += `<img class="worldmap__${discovery}" src="./assets/tex/${discovery}.png" data-playground="${discovery}">`;
            });
        }, 300);
    }

    async mageforestCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('mageforest'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            if (this.dataManager.save.storyAdvancement > 4) {
                document.querySelector('.mageforest__eglantine').dataset.voiceline = 'eglantinekiller';
            } else if (this.dataManager.save.storyAdvancement > 2) {
                document.querySelector('.mageforest__eglantine').dataset.voiceline = 'eglantineforestend';
            }
        }, 300);

    }

    async weirdhouseCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('weirdhouse'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            switch (this.dataManager.save.storyAdvancement) {
                case 4:
                    document.querySelector('.weirdhouse__nerd').dataset.event = 'nerdFight';
                    break;

                case 5:
                    document.querySelector('.playground__content').innerHTML += '<img class="weirdhouse__scroll" src="../assets/tex/scroll.png" data-event="scroll">';
                    break;
            }
            if (this.dataManager.save.storyAdvancement > 4) {
                document.querySelector('.weirdhouse__nerd').remove();
            }
        }, 300);
    }

    async networksCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('networks'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            if (this.dataManager.save.storyAdvancement > 3) {
                document.querySelector('.networks__glasses').remove();
            }
        }, 300);

    }

    async secretcaveCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('secretcave'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            if (this.dataManager.save.secrets.man1) {
                document.querySelector('.secretcave__man').remove();
            }
        }, 300);
    }


    distributeurEvent() {
        this.uiRenderer.createImage('playground', 'distributeur', 'main__distributeur', true);
        if (!this.dataManager.save.tools.includes('flashlight')) {
            this.audioManager.loadAudioFile('gotflashlight', 'sfx', [
                {
                    progress: 50, callback: () => {
                        this.uiRenderer.createImage('playground', 'flashlight', 'YESSSSSSSSSSS', true);
                    }
                },
                {
                    progress: 99, callback: () => {
                        this.dataManager.save.tools.push('flashlight');
                        this.uiRenderer.renderTools(this.dataManager.save.tools);
                        this.setupPlayground('restaurant');
                    }
                }
            ]);
        } else {
            setTimeout(() => {
                this.setupPlayground('restaurant');
            }, 600);
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
                        if (input.value.toLowerCase() == 'grombluchoire') {
                            this.unlockAchievement('grombluchoire');
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

    nerdFightEvent() {
        this.uiRenderer.createImage('playground', 'nerd', 'enzopleure', true);
        this.audioManager.loadAudioFile('enzoduel', 'voiceline', [
            {
                progress: 26, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantine', 'roboto', true);
                }
            },
            {
                progress: 46, callback: () => {
                    this.uiRenderer.createImage('playground', 'nerd', 'oula', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.triggerEvent('nerdBoss');
                }
            }
        ]);
    }

    nerdBossEvent() {
        this.audioManager.loadAudioFile('duel', 'music');
        this.uiRenderer.createImage('playground', 'nerd', 'main__boss', true, 'killNerd');
        this.uiRenderer.createImage('playground', 'nerdhealth', 'main__boss-health', false);
        this.uiRenderer.getElement('playground').innerHTML += '<img class="main__psychedelic" src="../assets/tex/wtf.gif">';
        setTimeout(() => {
            this.dataManager.canInterract = true;
        }, 300);
    }

    mermaidWorldEvent() {
        this.unlockAchievement('mermaidWorld')
        this.audioManager.loadAudioFile('harp', 'sfx')
        this.uiRenderer.createImage('playground', 'sirene', 'oh une sirene !!!', true);
        setTimeout(() => {
            this.audioManager.loadAudioFile('mermaidthanks', 'voiceline', [
                {
                    progress: 99, callback: () => {
                        this.setupPlayground('mermaidclose')
                    }
                }
            ])
        }, 3800);
    }

    // chanson magique
    mermaidsongEvent() {
        this.uiRenderer.createImage('playground', 'sirene', 'oh une sirene !!!', true);
        this.audioManager.loadAudioFile('mermaidsong', 'sfx', [
            {
                progress: 84, callback: () => {
                    this.uiRenderer.createImage('playground', 'nuclear', 'au revoir sirene', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.setupPlayground('mermaidclose')
                }
            }
        ])
    }

    man1Event() {
        this.uiRenderer.createImage('playground', 'man', '????', true);
        setTimeout(() => {
            window.open('./assets/hello.txt', '_blank');
        }, 600);

        setTimeout(() => {
            this.dataManager.save.secrets.man1 = true;
            this.setupPlayground('secretcave');
        }, 1200);
    }

    killNerdEvent() {
        this.uiRenderer.createImage('playground', 'eglantineterroriste', 'eglantinewsh', true);
        this.audioManager.loadAudioFile('attaquesurprise', 'voiceline', [
            {
                progress: 3, callback: () => {
                    this.uiRenderer.createImage('playground', 'nuclear', '??', true);
                }
            },
            {
                progress: 12, callback: () => {
                    this.uiRenderer.createImage('playground', 'nerddeath', 'kaboomlenerd', true);
                }
            },
            {
                progress: 38, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantineterroriste', 'eglantinewsh', true);
                }
            },
            {
                progress: 40, callback: () => {
                    this.uiRenderer.createImage('playground', 'nuclear', '??', true);
                }
            },
            {
                progress: 52, callback: () => {
                    this.uiRenderer.createImage('playground', 'triste', '??', true);
                }
            },
            {
                progress: 64, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantineterroriste', 'eglantinewsh', true);
                }
            },
            {
                progress: 68, callback: () => {
                    this.uiRenderer.createImage('playground', 'rire', 'eglantinewsh', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.unlockAchievement('enzo');
                    this.dataManager.save.storyAdvancement = 5;
                    this.setupPlayground('weirdhouse');
                }
            },
        ]);

    }

    creepyClownEvent() {
        this.uiRenderer.createImage('playground', 'scaryclown', 'main__boss', true, 'killNerd');
        this.audioManager.loadAudioFile('clown', 'voiceline', [
            {
                progress: 99, callback: () => {
                    this.setupPlayground('poolroom3');
                }
            }
        ])
    }

    async tableroomCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('tableroom'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            if (this.dataManager.save.secrets.poisonBurger) {
                document.querySelector('.poolroom__burger').remove();
            }
        }, 300);
    }

    poisonburgerEvent() {
        this.uiRenderer.getElement('playground').innerHTML = '';
        this.audioManager.loadAudioFile('eating', 'sfx');
        this.currentCountEvent++;
        setTimeout(() => {
            if (this.currentCountEvent === 3) {
                this.dataManager.save.secrets.poisonBurger = true;
                this.audioManager.loadAudioFile('poisondeath', 'voiceline', [
                    {
                        progress: 1, callback: () => {
                            this.unlockAchievement('foodDeath');
                            this.uiRenderer.createImage('playground', 'triste', 'hahaa mdr trop bon', true);
                        }
                    },
                    {
                        progress: 99, callback: () => {
                            this.setupPlayground('tableroom')
                        }
                    }
                ]);
            } else {
                this.audioManager.loadAudioFile('poison', 'voiceline', [
                    {
                        progress: 1, callback: () => {
                            this.uiRenderer.createImage('playground', 'rire', 'hahaa mdr trop bon', true);
                        }
                    },
                    {
                        progress: 99, callback: () => {
                            this.setupPlayground('tableroom');
                        }
                    }
                ]);
            }
        }, 1500);

    }

    creatureEvent() {
        this.audioManager.loadAudioFile('creature', 'voiceline');
        this.uiRenderer.createImage('playground', 'creature', 'oula bizarre', true);
        setTimeout(() => {
            this.setupPlayground('watercave')
        }, 5000);
    }

    async watercaveCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('watercave'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        setTimeout(() => {
            if (this.dataManager.save.secrets.waterkey) {
                document.querySelector('.underwater__key').remove();
            }
        }, 300);
    }
    async devroomCheck(playgroundData) {
        this.uiRenderer.loadPlayground(await this.requestManager.getPlayground('devroom'), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        this.unlockAchievement('devroom');
    }

    watercaveKeyEvent() {
        this.uiRenderer.createImage('playground', 'key', 'OMG', true);
        this.audioManager.loadAudioFile('secretkey', 'voiceline');
        this.dataManager.save.tools.push('key');
        this.dataManager.save.secrets.waterkey = true;
        this.uiRenderer.renderTools(this.dataManager.save.tools);
        this.dataManager.saveData();
        setTimeout(() => {
            this.setupPlayground('watercorridor')
        }, 5000);
    }

    cheesebirdEvent() {
        this.uiRenderer.createImage('playground', 'bird', 'main__oiseau', true);
        this.audioManager.loadAudioFile('fromage', 'voiceline', [
            {
                progress: 99, callback: () => {
                    this.unlockAchievement('cheesebird')
                    this.setupPlayground('mageriver');
                }
            }
        ]);
    }

    gnomeTimeEvent() {
        this.uiRenderer.createImage('playground', 'gnome', 'GNOME', true);

        const endDate = new Date();
        const spentTime = endDate.getTime() - this.uiController.startTime.getTime();
        this.dataManager.save.time += spentTime;
        this.uiController.startTime = new Date();

        this.uiRenderer.getElement('playground').append(`Tu as passé ${Math.floor(this.dataManager.save.time / 1000 / 60)} minutes sur miamo.fr !!!`);
        this.audioManager.loadAudioFile('gnome', 'voiceline', [
            {
                progress: 99, callback: () => {
                    this.setupPlayground('magecar');
                }
            }
        ]);
    }

    scrollEvent() {
        this.uiRenderer.createImage('playground', 'scroll', 'gpla perso', true);
        this.dataManager.save.storyAdvancement = 6;
        this.audioManager.loadAudioFile('scrollStory', 'voiceline', [
            {
                progress: 18, callback: () => {
                    this.uiRenderer.createImage('playground', 'rire', 'haha cool', true);
                }
            },
            {
                progress: 40, callback: () => {
                    this.uiRenderer.createImage('playground', 'scroll', 'gpla perso', true);
                }
            },
            {
                progress: 57, callback: () => {
                    this.uiRenderer.createImage('playground', 'rire', 'haha trop marrant', true);
                }
            },
            {
                progress: 72, callback: () => {
                    this.uiRenderer.createImage('playground', 'eglantine', 'super lecture eglantine', true);
                }
            },
            {
                progress: 80, callback: () => {
                    this.uiRenderer.createImage('playground', 'triste', 'super lecture eglantine', true);
                }
            },
            {
                progress: 88, callback: () => {
                    this.uiRenderer.createImage('playground', 'mario', 'italien', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.setupPlayground('hospitalentrance');
                }
            }
        ]);
    }

    nimbuffleSongEvent() {
        this.uiRenderer.createImage('playground', 'nimbuffle', 'main__nimbuffle', true);
        this.audioManager.loadAudioFile('nimbuffle', 'voiceline', [
            {
                progress: 41, callback: () => {
                    this.uiRenderer.createImage('playground', 'triste', 'sniffe il me faut nimbuffle', true);
                }
            },
            {
                progress: 48, callback: () => {
                    this.uiRenderer.createImage('playground', 'nimbuffle', 'ouf il est là', true);
                }
            },
            {
                progress: 52, callback: () => {
                    this.uiRenderer.createImage('playground', 'pasta', 'ohlesmiamopates', true);
                }
            },
            {
                progress: 56, callback: () => {
                    this.uiRenderer.createImage('playground', 'nimbuffle', 'main__nimbuffle', true);
                }
            },
            {
                progress: 69, callback: () => {
                    this.uiRenderer.createImage('playground', 'trompette', 'sa swingue', true);
                }
            },
            {
                progress: 85, callback: () => {
                    this.uiRenderer.createImage('playground', 'nerd', 'ptn il est chiant lui', true);
                }
            },
            {
                progress: 99, callback: () => {
                    this.unlockAchievement('nimbuffle');
                    this.setupPlayground('hospitalcorridor');
                }
            }
        ]);
    }

    hospitalDoorEvent() {
        if (this.dataManager.save.secrets.hospitalDoor) {
            this.setupPlayground('secretgarden');
        } else if (this.dataManager.save.tools.includes('key')) {
            this.dataManager.save.tools.splice(this.dataManager.save.tools.findIndex(tool => tool === 'key'), 1);
            this.uiRenderer.renderTools(this.dataManager.save.tools);
            this.dataManager.save.secrets.hospitalDoor = true;
            this.setupPlayground('secretgarden');
        } else {
            this.setupPlayground('hospitalcorridor');
        }
    }
}

