import * as Miamo from './miamo/index.js';

/**
 * QUI ETES VOUS
 * ARRETEZ DE PIRATER MIAMO.FR
 * C EST UN SUPER SITE
 * PARTEZ
 * 
 * DEPLOIMENT DE ROBOTS ANTI PIRATES 🤖🤖🤖🤖🤖🤖🤖
 * 
 * hop voila tu ne peux plus me pirater jeune pirateur
 */
const App = {
    model: {
        dataManager: Miamo.DataManager
    },

    view: {
        uiRenderer: Miamo.UiRenderer
    },

    controller: {
        uiController: Miamo.UiController,
        init: function () {
            if (['iPad Simulator', 'iPhone Simulator', 'iPod Simulator', 'iPad', 'iPhone', 'iPod'].includes(navigator.platform)) {
                document.write("bonjour jeune utilisateur d'appareil iOS, désoler mais je n ai pas envie de développer pour toi, reviens sur un ordinateur, merci")
                return;
            }
            App.model.dataManager = new Miamo.DataManager();
            App.view.uiRenderer = new Miamo.UiRenderer();
            App.controller.uiController = new Miamo.UiController(App.model.dataManager, App.view.uiRenderer);
        }
    },
}

window.addEventListener('load', App.controller.init);