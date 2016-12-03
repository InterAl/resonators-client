import SagaReducerFactory from 'SagaReducerFactory';
import { put, call } from 'redux-saga/effects';
import { actions, types } from '../actions/sessionActions';
import * as sessionApi from '../api/session';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        user: null,
        loggedIn: false
    }
});

handle(types.LOGIN, function*(sagaParams, action) {
    let {email, password} = action.payload;

    let user = yield call(sessionApi.create, email, password);
    yield updateUser(user);
});

handle(types.RESUME, function*(sagaParams, action) {
    let user = yield call(sessionApi.get);
    yield updateUser(user);
});

function* updateUser(user) {
    yield put(updateState({
        user,
        loggedIn: user.expires_at > 0
    }));
}

export default {saga, reducer};
