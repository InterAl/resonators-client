import { put } from 'redux-saga/effects';
import SagaReducerFactory from 'SagaReducerFactory';
import { actions, types } from '../actions/initActions';
import { actions as sessionActions } from '../actions/sessionActions';

let {handle, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {}
});

handle(types.INIT_APP, function*() {
    // yield put(sessionActions.resume());
});

export default {saga, reducer};
