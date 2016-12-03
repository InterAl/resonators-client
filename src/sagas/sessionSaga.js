import SagaReducerFactory from 'SagaReducerFactory';
import { put, call, select } from 'redux-saga/effects';
import { actions, types } from '../actions/sessionActions';
import * as sessionApi from '../api/session';
import {browserHistory} from 'react-router';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        user: null,
        loggedIn: false
    }
});

handle(types.RESUME, function*(sagaParams, action) {
    let user = yield call(sessionApi.get);
    let loggedIn = yield updateUser(user);

    if (!loggedIn)
        browserHistory.replace('/react');
});

handle(types.LOGIN, function*(sagaParams, action) {
    let {email, password} = action.payload;

    let user;

    try {
        user = yield call(sessionApi.create, email, password);
    } catch (err) {
        console.warn('login failed', err);
    }

    let loggedIn = yield updateUser(user);

    if (!loggedIn)
        yield put({
            type: "@@redux-form/SET_SUBMIT_FAILED",
            error: true,
            meta: {
                form: "login",
                fields: []
            }
        });
});

handle(types.LOGOUT, function*() {
    try {
        let sessionId = yield select(state => state.session.user.id);
        yield call(sessionApi.logout, sessionId);
        browserHistory.replace('/react');
    } catch (err) {
        console.warn('logout failed', err);
    }
});

function* updateUser(user = {}) {
    const loggedIn = new Date(user.expires_at) > new Date();

    yield put(updateState({
        user,
        loggedIn
    }));

    if (loggedIn) {
        browserHistory.push(`/react/followers`);
    }

    return loggedIn;
}

export default {saga, reducer};
