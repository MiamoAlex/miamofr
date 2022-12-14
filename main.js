import * as Miamo from './miamo/index.js';

/**
 * OH NON ATTENTION IL Y A UN HACKER SUR MIAMO.FR OH NON OH NON PARTEZ D'ICI NON 
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
        init: function() {
            App.model.dataManager = new Miamo.DataManager();
            App.view.uiRenderer = new Miamo.UiRenderer();
            App.controller.uiController = new Miamo.UiController(App.model.dataManager, App.view.uiRenderer, new Miamo.AudioManager());
        }
    },
}

window.addEventListener('load', App.controller.init);