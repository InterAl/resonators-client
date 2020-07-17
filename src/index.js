import 'babel-polyfill';
import 'whatwg-fetch';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import {actions as initActions} from './actions/initActions';
import { AppContainer } from 'react-hot-loader';
import App from './containers/App';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const store = configureStore();

store.dispatch(initActions.initApp());

render(
  <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
  </AppContainer>
  ,
  document.getElementById('app')
)

if (module.hot) {
    module.hot.accept('./containers/App', () => {
        const NextApp = require('./containers/App').default; // eslint-disable-line global-require

        render(
            <AppContainer>
                <Provider store={store}>
                    <NextApp />
                </Provider>
            </AppContainer>,
        document.getElementById('app'));
    });
}

window.addEventListener("load", () => {
    if (navigator.serviceWorker) {
        console.log("Registering service worker...")
        navigator.serviceWorker.register("./serviceWorker.js")
        .then(() => console.log("Service worker registered!"))
        .catch(() => console.log("Service worker registration failed :("))
    }
    else {
        console.log("Service workers are unsupported by this browser")
    }
})
