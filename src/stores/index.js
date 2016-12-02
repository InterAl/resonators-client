import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import saga from '../sagas';
import reducers from '../reducers';
import createReduxLogger from 'redux-logger';

function reduxStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();
  const reduxLogger = createReduxLogger();

  const store = createStore(reducers, initialState,
    applyMiddleware(
        reduxLogger,
        // window.devToolsExtension && window.devToolsExtension(),
        sagaMiddleware
    ));

  sagaMiddleware.run(saga);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      // We need to require for hot reloadign to work properly.
      const nextReducer = require('../reducers');  // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

export default reduxStore;
