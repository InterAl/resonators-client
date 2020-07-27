import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import history from './history';
import createSagaMiddleware from 'redux-saga';
import { sagas, createReducers } from '../sagas';
import logger from 'redux-logger';

function reduxStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createReducers(history),
    initialState,
    compose(
      applyMiddleware(
        sagaMiddleware,
        logger,
        routerMiddleware(history)
      )
    )
  );

  sagaMiddleware.run(sagas);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../sagas', () => {
      // We need to require for hot reloading to work properly.
      const nextReducer = require('../sagas').createReducers(history);  // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default reduxStore;
