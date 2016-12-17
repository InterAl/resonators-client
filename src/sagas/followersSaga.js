import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
import { call, put, select, take } from 'redux-saga/effects';
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
    yield fetchFollowerResonators(payload);
});

export function* waitForFollowers() {
    let followers;

    do {
        followers = yield select(followersSelector);
        if (followers.length > 0)
            break;
        else
            yield take('*');
    } while (followers.length === 0)
}

export function* fetchFollowerResonators(followerId) {
    let follower = yield getFollower(followerId);

    if (!follower.resonators) {
        let followerResonators = yield call(followerApi.getResonators, followerId);

        let patchedFollower = {
            ...follower,
            resonators: followerResonators
        };

        yield updateStateWithNewFollower(patchedFollower);
    }
}

function* updateStateWithNewFollower(follower) {
    let lastFollowers = yield select(followersSelector);

    let followers = _.reject(lastFollowers, f => f.id === follower.id)
                     .concat(follower);

    yield put(updateState({
        followers
    }));
}

export function* updateResonator(followerId, resonator) {
    let followers = yield select(followersSelector);

    let follower = _.find(followers, f => f.id === followerId);

    let updatedResonators = _.reject(follower.resonators, r => r.id === resonator.id)
                             .concat(resonator);

    let updatedFollower = {...follower, updatedResonators};

    let updatedFollowers = _.reject(followers, f => f.id === followerId)
                            .concat(updatedFollower);

    yield put(updateState({
        followers: updatedFollowers
    }));
}

function* getFollower(id) {
    let followers = yield select(followersSelector);
    return _.find(followers, f => f.id === id);
}

export default {saga, reducer};
