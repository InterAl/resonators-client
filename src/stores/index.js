import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import history from './history';
import createSagaMiddleware from 'redux-saga';
import {sagas, reducers} from '../sagas';
import createReduxLogger from 'redux-logger';

function reduxStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const reduxLogger = createReduxLogger();

  const store = createStore(reducers, initialState,
    applyMiddleware(
        sagaMiddleware,
        reduxLogger,
        routerMiddleware(history)
    ));

  sagaMiddleware.run(sagas);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../sagas', () => {
      // We need to require for hot reloadign to work properly.
      const nextReducer = require('../sagas').reducers;  // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default reduxStore;
