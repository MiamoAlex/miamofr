export class EventHandler {
    introEvent() {
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

    burgerEvent() {
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

    eglantineEvent() {
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

    hectorEvent() {
        this.audioManager.loadAudioFile('hectordeath');
        this.uiRenderer.createImage('main', 'burgers', 'main__burgers', true);
        setTimeout(() => {
            this.audioManager.loadAudioFile('chuchotemment');
            this.uiRenderer.createImage('main', 'gustave', 'main__gustave', true);
        }, 11000);
    }
}