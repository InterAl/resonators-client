import _ from 'lodash';
import SagaReducerFactory from 'saga-reducer-factory';
import { put, call, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { actions, types } from '../actions/sessionActions';
import formErrorAction from '../actions/formError';
import * as sessionApi from '../api/session';
import {actions as navigationActions} from '../actions/navigationActions';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        user: null,
        loggedIn: false
    }
});

handle(types.RESUME, function*() {
    try {
        let user = yield call(sessionApi.get);
        let loggedIn = yield updateUser(user);

        if (!loggedIn)
            yield put(navigationActions.navigate('login'));
    } catch (err) {
        console.log('resuming session failed', err);
        yield put(navigationActions.navigate('login'));
    }
});

handle(types.LOGIN, function*(sagaParams, action) {
    let {email, password} = action.payload;

    let user;

    try {
        user = yield call(sessionApi.create, email, password);
    } catch (err) {
        console.warn('login failed', err);
    }

    let {auth_token} = user;

    saveAuthToken(auth_token);

    user = _.omit(user, 'auth_token');

    let loggedIn = yield updateUser(user);

    if (!loggedIn)
        yield put(formErrorAction('login'));
});

handle(types.LOGOUT, function*() {
    try {
        yield call(sessionApi.logout);
        yield put(updateState({
            loggedIn: false
        }));
        yield put(navigationActions.navigate('logout'));
    } catch (err) {
        console.warn('logout failed', err);
    }
});

handle(types.REGISTER, function*(sagaParams, {payload}) {
    try {
        yield put(updateState({ registrationFailed: false }));
        let user = yield call(sessionApi.register, payload.email, payload.name, payload.password);
        yield updateUser(user);
        yield put(navigationActions.hideModal());
    } catch (err) {
        console.error('registration failed', err);
        yield put(updateState({ registrationFailed: true }));
    }
});

handle(types.GOOGLE_LOGIN, function*() {
    try {
        const {url} = yield call(sessionApi.startGoogleLogin);
        location.href = url;
    } catch (err) {
        console.error('google login failed', err);
    }
});

handle(types.RECOVER_PASSWORD, function*(sagaParams, {payload}) {
    try {
        yield put(updateState({ forgotPasswordSpinner: true, forgotPasswordFailed: false }));
        yield call(sessionApi.recoverPassword, payload.email);
        yield put(navigationActions.hideModal());
        yield put(navigationActions.showModal({
            name: 'forgotPasswordSuccess'
        }));
        yield put(updateState({ forgotPasswordSpinner: false }));
    } catch (err) {
        console.error('password recovery failed', err);
        yield put(updateState({ forgotPasswordSpinner: false, forgotPasswordFailed: true}));
    }
});

handle(types.RESET_PASSWORD, function*(sagaParams, {payload}) {
    const spin = active => put(updateState({ resetPasswordSpinner: active }));

    try {
        yield spin(true);

        const token = yield select(state => state.init.query.token);

        yield sessionApi.resetPassword({
            password: payload,
            token
        });

        yield put(updateState({
            resetPasswordSuccessful: true
        }));
        yield delay(3500);
        yield spin(false);
        yield put(navigationActions.navigate('login'));
    } catch (err) {
        console.error('password reset failed', err);
        yield spin(false);
        yield put(updateState({
            resetPasswordSuccessful: false
        }));
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

        const currentPath = location.pathname;

        if (currentPath === '/' || currentPath === '/login')
            yield put(navigationActions.navigate('followers'));
    }

    return loggedIn;
}

function saveAuthToken(auth_token) {
    localStorage.setItem('auth_token', auth_token);
}

export default {saga, reducer};
