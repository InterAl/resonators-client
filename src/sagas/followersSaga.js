import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/followersActions';
import { types as sessionActionTypes} from '../actions/sessionActions';
import * as followerApi from '../api/follower';

let followersSelector = state => state.followers.followers;

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

handle(types.CREATE, function*(sagaParams, {payload}) {
    let follower = yield call(followerApi.create, payload);

    follower.user.email = payload.email;
    yield updateStateWithNewFollower(follower);
});

handle(types.DELETE, function*(sagaParams, {payload}) {
    yield call(followerApi.deleteFollower, payload);
    let followers = yield select(followersSelector);
    let followersWithoutDeleted = _.reject(followers, f => f.id === payload);

    yield put(updateState({
        followers: followersWithoutDeleted
    }));
});

handle(types.UPDATE, function*(sagaParams, {payload}) {
    yield call(followerApi.edit, payload);
    let follower = yield getFollower(payload.id);

    let updatedFollower = {
        ...follower,
        user: {
            ...follower.user,
            name: payload.name,
            email: payload.email
        }
    };

    yield updateStateWithNewFollower(updatedFollower);
});

handle(types.FETCH_FOLLOWER_RESONATORS, function*(sagaParams, {payload}) {
    let follower = yield getFollower(payload);

    if (!follower.resonators) {
        let followerResonators = yield call(followerApi.getResonators, payload);

        let patchedFollower = {
            ...follower,
            resonators: followerResonators
        };

        yield updateStateWithNewFollower(patchedFollower);
    }
});

function* updateStateWithNewFollower(follower) {
    let lastFollowers = yield select(followersSelector);

    let followers = _.reject(lastFollowers, f => f.id === follower.id)
                     .concat(follower);

    yield put(updateState({
        followers
    }));
}

function* getFollower(id) {
    let followers = yield select(followersSelector);
    return _.find(followers, f => f.id === id);
}

export default {saga, reducer};
