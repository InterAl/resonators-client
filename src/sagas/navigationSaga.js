import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
import { put } from 'redux-saga/effects';
import { actions, types } from '../actions/navigationActions';
import { push } from 'connected-react-router';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        modal: null
    }
});

const screenToRoute = {
    'followers': {
        route: '/followers'
    },
    'clinics': {
        route: '/clinics'
    },
    'followerResonators': {
        route: '/followers/:followerId/resonators',
    },
    'login': {
        route: '/login',
    },
    'logout': {
        route: '/login',
    },
    'criteriaCreation': {
        route: '/clinics/criteria/new',
    },
    'criteriaList': {
        route: '/clinics/criteria',
    },
    'follower/resonators': {
        route: '/follower/resonators',
    },
};

handle(types.NAVIGATE, function*(sagaParams, {payload}) {
    let {requestedRoute, routeParams} = parseNavigationRequestPayload(payload);
    let {route} = getScreenRoute(requestedRoute);

    if (routeParams) {
        route = resolveParameterizedRoute(route, routeParams);
    }

    yield put(push(route));
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
    let replace, route, routeParams;

    if (typeof payload === 'string') {
        route = payload;
    } else {
        ({replace, route, routeParams} = payload);
    }

    return { requestedRoute: route, replace, routeParams };
}

function getScreenRoute(screen) {
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
