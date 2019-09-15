import _ from 'lodash';
import { put } from 'redux-saga/effects';
import SagaReducerFactory from 'saga-reducer-factory';
import { actions, types } from '../actions/initActions';
import { actions as sessionActions } from '../actions/sessionActions';
import queryString from 'query-string';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {}
});

handle(types.INIT_APP, function*() {
    const query = queryString.parse(location.search);

    yield put(updateState({
        query
    }));

    if (_.startsWith(location.pathname, '/resetPassword') ||
        _.endsWith(location.pathname, '/criteria/submit') ||
        _.endsWith(location.pathname, '/questionnaire/submit') ||
        _.endsWith(location.pathname, '/diary/submit') ||
        location.pathname === '/')
        return;

    yield put(sessionActions.resume());
});

export default {saga, reducer};
