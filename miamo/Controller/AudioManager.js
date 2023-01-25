export class AudioManager {

    volume = .5;
    currentSounds = [];
    loadedSounds = {};

    constructor() {
        if ('AudioContext' in window || 'webkitAudioContext' in window) {
            document.body.addEventListener('click', () => this.unlockContext());
        }
    }

    /**
     * unlockContext() dévérouille le son sur le jeu
    */
    unlockContext() {
        if (!this.context) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.context = new AudioContext();
            this.gainNode = this.context.createGain();
            this.gainNode.gain.value = this.volume;

            const buffer = this.context.createBuffer(1, 1, 22050);
            const source = this.context.createBufferSource();
            source.buffer = buffer;
            source.connect(this.context.destination);
            source.start ? source.start(0) : source.noteOn(0);
        }
    }

    /**
     * playAudioFile() s'occupe de charger un fichier audio pour le jouer
     * @param {String} audio Nom d'un fichier audio
     * @param {Array<Object>} callbacks Callbacks à jouer selon un certain temps
     */
    playAudioFile(file) {
        let buffer;
        if (this.volume > 0) {
            this.gainNode.gain.value = this.volume;
            const source = this.context.createBufferSource();
            this.currentSounds.push(source);
            // Récupération du son en mis en cache
            if (this.loadedSounds[`${this.currentTheme}/${file}`]) {
                buffer = this.loadedSounds[`${this.currentTheme}/${file}`];
                source.buffer = buffer;
                source.connect(this.context.destination);
                source.start();
            } else {
                window.fetch(`./assets/audio/${this.currentTheme}/${file}.mp3`)
                    .then(response => response.arrayBuffer())
                    .then(arrayBuffer => this.context.decodeAudioData(arrayBuffer,
                        audioBuffer => {
                            this.loadedSounds[`${this.currentTheme}/${file}`] = audioBuffer;
                            source.buffer = audioBuffer;
                            source.connect(this.context.destination);
                            source.start ? source.start() : source.noteOn(0);
                        }
                    ));
            }
        }
    }
    /**
     * loadAudioFile() s'occupe de charger un fichier audio pour le jouer
     * @param {String} audio Nom d'un fichier audio
     * @param {Array<Object>} callbacks Callbacks à jouer selon un certain temps
     */
    loadAudioFile(audioName, type, callbacks) {
        const audio = new Audio(`./assets/audio/${type}/${audioName}.mp3`);
        audio.volume = this.volume;
        switch (type) {
            case 'voiceline':
                if (this.currentVoiceLine) {
                    this.currentVoiceLine.pause();
                }
                this.currentVoiceLine = audio;
                break;

            case 'music':
                if (this.currentMusic && this.currentMusic.src !== audio.src) {
                    this.currentMusic.pause();
                } else if (this.currentMusic && this.currentMusic.src == audio.src) {
                    return
                }
                audio.volume = this.volume * .65;
                this.currentMusic = audio;
                audio.loop = true;
                break;
        }

        audio.play();
        this.currentSounds.push(audio);

        audio.addEventListener('timeupdate', (ev) => {
            let progress = Math.floor(ev.target.currentTime / audio.duration * 100)

            if (callbacks) {
                for (let i = 0; i < callbacks.length; i++) {
                    const callback = callbacks[i];
                    if (progress >= callback.progress) {
                        callback.callback();
                        callbacks.splice(i, 1);
                    }
                }
            }

            if (progress === 100 && audio.loop === false) {
                this.currentSounds.splice(this.currentSounds.findIndex(currentAudio => currentAudio === audio), 1)
            }
        });
    }
}