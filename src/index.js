import "whatwg-fetch";
import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import { AppContainer } from "react-hot-loader";

import App from "./containers/App";
import configureStore from "./stores";
import { subscribeToPushNotifications } from "./push";
import { actions as pwaActions } from "./actions/pwaActions";
import { actions as initActions } from "./actions/initActions";

function renderApp() {
    render(
        <AppContainer>
            <Provider store={store}>
                <App />
            </Provider>
        </AppContainer>,
        document.body
    );

    if (module.hot) {
        module.hot.accept("./containers/App", () => {
            const NextApp = require("./containers/App").default; // eslint-disable-line global-require

            render(
                <AppContainer>
                    <Provider store={store}>
                        <NextApp />
                    </Provider>
                </AppContainer>,
                document.body
            );
        });
    }
}

function registerServiceWorker() {
    window.addEventListener("load", () => {
        if (navigator.serviceWorker) {
            console.log("Registering service worker...");
            navigator.serviceWorker
                .register("/serviceWorker.js")
                .then(() => console.log("Service worker registered!"))
                .catch((error) => console.error(`Service worker registration failed: ${error}`));
        } else {
            console.log("Service workers are not supported by this browser");
        }
    });
}

function registerInstallationActions(dispatch) {
    window.addEventListener("beforeinstallprompt", (installPrompt) => {
        installPrompt.preventDefault();
        dispatch(pwaActions.registerInstallPrompt(installPrompt));
    });
    window.addEventListener("appinstalled", () => {
        dispatch(pwaActions.appInstalled());
    });
}

const store = configureStore();
store.dispatch(initActions.initApp());
renderApp();
registerServiceWorker();
registerInstallationActions(store.dispatch);
subscribeToPushNotifications();
