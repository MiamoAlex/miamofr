export class EventHandler {
    constructor(uiController) {
        this.uiController = uiController;
        this.uiRenderer = this.uiController.uiRenderer;
        this.audioManager = this.uiController.audioManager;
        this.dataManager = this.uiController.dataManager;
        this.requestManager = this.uiController.requestManager;
    }

    currentCountEvent = 0;
    lastEvent = '';
    /**
     * triggerEvent enclenche un evenement de l'histoire
     * @param {Event} event Evenement à enclencher
     * @param {*} ev Eventuel evenement js
     */
    triggerEvent(event, ev) {
        this.dataManager.canInterract = false;
        this.dataManager.playMode = 'playground';
        if (event !== 'intro' && event !== 'antiPiracy' && event !== 'resetSave') {
            this.dataManager.setMiamoState(event);
            this.dataManager.saveData();
            if (this.audioManager.currentMusic) {
                this.audioManager.currentMusic.pause();
                this.audioManager.currentMusic = undefined
            }
        }
        this[`${event}Event`](ev);
        if (this.lastEvent !== event) {
            this.lastEvent = event;
            this.currentCountEvent = 0;
        }

    };

    /**
     * introEvent() gère l'animatino du lancement de la page et la suite
     * @param {Evenement au clic} ev Clic sur miamo.fr 
     */
    introEvent(ev) {
        // this.dataManager.setMiamoState(this.dataManager.save.state);
        // if (this[`${this.dataManager.getMiamoState()}Event`]) {
        //     this.triggerEvent(this.dataManager.getMiamoState());
        // } else {
        //     this.setupPlayground(this.dataManager.getMiamoState());
        // }
        // this.uiRenderer.renderTools(this.dataManager.save.tools);
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        }

        ev.target.classList.add('main__h1-anim')
        this.audioManager.loadAudioFile('intro', 'voiceline', [
            // le logo devient .fr
            {
                progress: 80, callback: () => {
                    ev.target.textContent = '.fr';
                }
            },
            // chargement de la sauvegarde ou début de la partie
            {
                progress: 95, callback: () => {
                    this.dataManager.setMiamoState(this.dataManager.save.state);
                    if (this[`${this.dataManager.getMiamoState()}Event`]) {
                        this.triggerEvent(this.dataManager.getMiamoState());
                    } else {
                        this.setupPlayground(this.dataManager.getMiamoState());
                    }
                    this.uiRenderer.renderTools(this.dataManager.save.tools);
                }
            }
        ]);
    }

    /**
     * antiPiracyEvent fait apparaitre un gros bébé énervé contre les méchants pirates
     */
    antiPiracyEvent() {
        this.unlockAchievement('cheater');
        this.audioManager.loadAudioFile('antipiracy', 'voiceline', [
            {
                progress: 1, callback: () => {
                    this.uiRenderer.createImage('playground', 'antipiracy', 'main__bebz', true, 'miamoIntro');
                    this.uiRenderer.getElement('playground').append('écran sécurité anti pirate !! ! !! ! ! !!! bébé police')
                }
            },
            {
                progress: 95, callback: () => {
                    this.dataManager.setMiamoState(this.dataManager.save.state);
                    if (this[`${this.dataManager.getMiamoState()}Event`]) {
                        this.triggerEvent(this.dataManager.getMiamoState());
                    } else {
                        this.setupPlayground(this.dataManager.getMiamoState());
                    }
                }
            }
        ]);
    }

    resetSaveEvent() {
        this.uiRenderer.createImage('playground', 'alerte', 'danger', true)
        this.audioManager.loadAudioFile('resetSave', 'voiceline', [
            {
                progress: 80, callback: () => {
                    this.uiRenderer.getElement('playground').innerHTML += '<input class="gagoug" type="text" placeholder="ECRIRE GAGOUG">';
                    setTimeout(() => {
                        const input = document.querySelector('.gagoug');
                        if (input.value.toLowerCase() == 'gagoug') {
                            this.dataManager.save = undefined;
                            localStorage.clear();
                            document.location.reload();
                        } else {
                            if (this[`${this.dataManager.getMiamoState()}Event`]) {
                                this.triggerEvent(this.dataManager.getMiamoState());
                            } else {
                                this.setupPlayground(this.dataManager.getMiamoState());
                            }
                            this.uiRenderer.renderTools(this.dataManager.save.tools);
                        }
                    }, 7500);
                }
            }
        ])

    }

    /**
     * Evenement général de génération des playgrounds
     * @param {String} playgroundName 
     */
    async setupPlayground(playgroundName) {
        this.dataManager.canInterract = false;
        this.dataManager.playMode = 'playground';
        const playgroundData = this.playgroundModels[playgroundName];
        this.playgroundName = playgroundName;
        this.currentPlayground = playgroundData;

        // Musique ou ambiance de fond
        if (playgroundData.music) {
            this.audioManager.loadAudioFile(playgroundData.music, 'music');
        } else if (this.audioManager.currentMusic) {
            this.audioManager.currentMusic.pause();
            this.audioManager.currentMusic = undefined;
        }
        // Le joueur à découvert une zone importante
        if (playgroundData.discovery && !this.dataManager.save.discoveries.includes(playgroundName)) {
            this.dataManager.save.discoveries.push(playgroundName);
        }

        this.dataManager.setMiamoState(playgroundName);
        this.dataManager.saveData();
        if (playgroundData.storyCheck) {
            this[`${playgroundName}Check`](playgroundData);
        } else {
            this.uiRenderer.loadPlayground(await this.requestManager.getPlayground(playgroundName), playgroundData.sandwiches, this.dataManager.save.sandwiches);
        }

        // Gestion de la flashlight
        setTimeout(() => {
            if (playgroundData.flashlight) {
                if (this.uiRenderer.getElement('playground').classList[1] !== 'playground__flashlight') {
                    this.uiRenderer.getElement('playground').classList.add('playground__dark');
                }
            } else {
                this.uiRenderer.getElement('playground').classList.remove('playground__flashlight');
                this.uiRenderer.getElement('playground').classList.remove('playground__dark');
            }
        }, 300);

        // On libère le joueur
        setTimeout(() => {
            this.dataManager.canInterract = true;
        }, 800);
    }

    /**
     * unlockAchievement() débloque un succès au joueur
     * @param {String} achievementId identifiant du succès à débloquer 
     */
    unlockAchievement(achievementId) {
        if (!this.dataManager.save.achievements.includes(achievementId)) {
            this.audioManager.loadAudioFile('achievement', 'sfx')
            this.dataManager.save.achievements.push(achievementId);
            let currentAchievements = [];
            this.dataManager.save.achievements.forEach(achievement => {
                currentAchievements.push(this.dataManager.achievements[achievement]);
            });
            this.uiRenderer.renderTemplate(document.querySelector('.template__achievement'), currentAchievements, this.uiRenderer.getElement('achievements'));
            this.uiRenderer.renderAchievement([this.dataManager.achievements[achievementId]]);
            this.dataManager.saveData();
        }
    }

}