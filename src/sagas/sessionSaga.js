import SagaReducerFactory from 'saga-reducer-factory';
import { put, call, select } from 'redux-saga/effects';
import { actions, types } from '../actions/sessionActions';
import formErrorAction from '../actions/formError';
import * as sessionApi from '../api/session';
import {actions as navigationActions} from '../actions/navigationActions';
import {browserHistory} from 'react-router';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        user: null,
        loggedIn: false
    }
});

handle(types.RESUME, function*() {
    let user = yield call(sessionApi.get);
    let loggedIn = yield updateUser(user);

    if (!loggedIn)
        yield put(navigationActions.navigate('login'));
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
        yield put(formErrorAction('login'));
});

handle(types.LOGOUT, function*() {
    try {
        let sessionId = yield select(state => state.session.user.id);
        yield call(sessionApi.logout, sessionId);
        yield put(navigationActions.navigate('logout'));
    } catch (err) {
        console.warn('logout failed', err);
    }
});

handle(types.REGISTER, function*(sagaParams, {payload}) {
    try {
        let user = yield call(sessionApi.register, payload.email, payload.name, payload.password);
        yield updateUser(user);
        yield put(navigationActions.hideModal());
    } catch (err) {
        console.error('registration failed', err);
    }
});

function* updateUser(user = {}) {
    const loggedIn = new Date(user.expires_at) > new Date();

    yield put(updateState({
        user,
        loggedIn
    }));

    if (loggedIn) {
        yield put(actions.loginSuccess());

        if (browserHistory.getCurrentLocation().pathname === '/react' ||
            browserHistory.getCurrentLocation().pathname === '/react/')
            yield put(navigationActions.navigate('followers'));
    }

    return loggedIn;
}

export default {saga, reducer};
