import _ from 'lodash';
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
    'followerResonators': {
        route: '/react/followers/:followerId/resonators',
        title: 'Resonators'
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
    let {requestedRoute, replace, params} = parseNavigationRequestPayload(payload);
    let {route, title} = getScreenRoute(requestedRoute, params);

    if (params) {
        route = resolveParameterizedRoute(route, params);
    }

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
    let replace, route, params;

    if (typeof payload === 'string') {
        route = payload;
    } else {
        ({replace, route, params} = payload);
    }

    return { requestedRoute: route, replace, params };
}

function getScreenRoute(screen, params) {
    let route = screenToRoute[screen] || screenToRoute['login'];
    return route;
}

function resolveParameterizedRoute(route, params) {
    return _.reduce(_.keys(params), (acc, cur) => {
        let replaced = acc.replace(`:${cur}`, params[cur]);
        return replaced;
    }, route);
}

export default {saga, reducer};
