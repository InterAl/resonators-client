import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './stores';
import {actions as initActions} from './actions/initActions';
import App from './containers/App';

const store = configureStore();

store.dispatch(initActions.initApp());

render(
  <Provider store={store}>
    <App />
  </Provider>,

  document.getElementById('app')
)
