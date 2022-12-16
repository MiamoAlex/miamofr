export class AudioManager {

    volume = .5;
    currentSounds = [];


    constructor() {
    }

    /**
     * loadAudioFile() s'occupe de charger un fichier audio pour le jouer
     * @param {String} audio Nom d'un fichier audio
     * @param {Array<Object>} callbacks Callbacks à jouer selon un certain temps
     */
    loadAudioFile(audioName, type, callbacks) {
        const audio = new Audio(`./assets/audio/${type}/${audioName}.mp3`);
        audio.volume = this.volume;
        audio.play();
        this.currentSounds.push(audio);

        switch (type) {
            case 'voiceline':
                if (this.currentVoiceLine) {
                    this.currentVoiceLine.pause();
                }
                this.currentVoiceLine = audio;
                break;

            case 'music':
                if (this.currentMusic) {
                    this.currentMusic.pause();
                }
                audio.volume = this.volume * .65;
                this.currentMusic = audio;
                audio.loop = true;
                break;
        }


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