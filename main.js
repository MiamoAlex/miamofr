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

        init: async function () {
            // moi quand je fais une gestion de cache
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('sw.js');
            }

            App.model.dataManager = new Miamo.DataManager();
            App.view.uiRenderer = new Miamo.UiRenderer();
            App.controller.uiController = new Miamo.UiController(App.model.dataManager, App.view.uiRenderer, window);
            App.controller.uiController.eventHandler.playgroundModels = await App.controller.uiController.requestManager.getPlaygroundModel();
            App.model.dataManager.achievements = await App.controller.uiController.requestManager.getAchievements();
        }
    },
}

window.addEventListener('load', App.controller.init);