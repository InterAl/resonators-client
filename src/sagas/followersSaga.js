import SagaReducerFactory from 'SagaReducerFactory';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/followersActions';
import { types as sessionActionTypes} from '../actions/sessionActions';
import * as followerApi from '../api/follower';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        followers: [],
        filterByClinicId: 'all'
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function*() {
    let followers = yield call(followerApi.get);

    yield put(updateState({
        followers
    }));
});

handle(types.FILTER_BY_CLINIC_ID, function*(sagaParams, {payload}) {
    yield put(updateState({
        filterByClinicId: String(payload)
    }));
});

export default {saga, reducer};
