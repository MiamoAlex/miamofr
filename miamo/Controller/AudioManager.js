export class AudioManager {

    volume = .5;

    /**
     * loadAudioFile() s'occupe de charger un fichier audio pour le jouer
     * @param {String} audio Nom d'un fichier audio
     */
    loadAudioFile (audioName) {
        const audio = new Audio(`./assets/audio/${audioName}.mp3`);
        audio.volume = this.volume;
        audio.play();
    }
}