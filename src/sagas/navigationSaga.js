import SagaReducerFactory from 'SagaReducerFactory';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/navigationActions';
import {browserHistory} from 'react-router';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        title: 'Resonators',
        modal: null
    }
});

const screenToRoute = {
    'followers': {
        route: '/react/followers',
        title: 'Followers'
    },
    'login': {
        route: '/react',
        title: 'Resonators'
    },
    'logout': {
        route: '/react/',
        title: 'Resonators'
    }
};

handle(types.NAVIGATE, function*(sagaParams, {payload}) {
    let {requestedRoute, replace} = parseNavigationRequestPayload(payload);
    let {route, title} = getScreenRoute(requestedRoute);

    if (payload.replace)
        browserHistory.replace(route);
    else
        browserHistory.push(route);

    yield put(updateState({
        title
    }));
});

handle(types.SHOW_MODAL, function*(sagaParams, {payload}) {
    yield put(updateState({
        modal: {
            name: payload.name,
            props: payload.props
        }
    }));
});

handle(types.HIDE_MODAL, function*() {
    yield put(updateState({
        modal: null
    }));
});

function parseNavigationRequestPayload(payload) {
    let replace, route;

    if (typeof payload === 'string') {
        route = payload;
    } else {
        route = payload.route;
        replace = payload.repalce;
    }

    return { requestedRoute: route, replace };
}

function getScreenRoute(screen) {
    return screenToRoute[screen] || screenToRoute['login'];
}

export default {saga, reducer};
