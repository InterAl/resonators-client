import _ from 'lodash';
import SagaReducerFactory from 'saga-reducer-factory';
import { call, put, select, take } from 'redux-saga/effects';
import { actions, types } from '../actions/followersActions';
import { types as resonatorTypes } from '../actions/resonatorActions';
import { types as sessionActionTypes } from '../actions/sessionActions';
import * as followerApi from '../api/follower';

let followersSelector = state => state.followers.followers;

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        followers: [],
        filterByClinicId: 'all'
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function* () {
    let followers = yield call(followerApi.get);

    yield put(updateState({
        followers
    }));
});

handle(types.CREATE, function* (sagaParams, { payload }) {
    let follower = yield call(followerApi.create, payload);

    follower.user.email = payload.email;
    yield updateStateWithNewFollower(follower);
});

handle(types.DELETE, function* (sagaParams, { payload }) {
    yield call(followerApi.deleteFollower, payload);
    let followers = yield select(followersSelector);
    let followersWithoutDeleted = _.reject(followers, f => f.id === payload);

    yield put(updateState({
        followers: followersWithoutDeleted
    }));
});

handle(types.FREEZE, function* (sagaParams, { payload }) {
    yield call(followerApi.freezeFollower, payload);
    const follower = yield getFollower(payload);

    const updatedFollower = {
        ...follower,
        frozen: true
    };

    yield updateStateWithNewFollower(updatedFollower);
});

handle(types.UNFREEZE, function* (sagaParams, { payload }) {
    yield call(followerApi.unfreezeFollower, payload);
    const follower = yield getFollower(payload);

    const updatedFollower = {
        ...follower,
        frozen: false
    };

    yield updateStateWithNewFollower(updatedFollower);
});

handle(types.TOGGLE_DISPLAY_FROZEN, function* (sagaParams, { payload }) {
    const { displayFrozen } = yield select(state => state.followers);

    yield put(updateState({
        displayFrozen: !displayFrozen
    }));
});

handle(types.UPDATE, function* (sagaParams, { payload }) {
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

handle(types.FETCH_FOLLOWER_RESONATORS, function* (sagaParams, { payload }) {
    yield fetchFollowerResonators(payload);
});

handle(resonatorTypes.REMOVE, function* (sagaParams, { payload }) {
    const { resonator: { id, follower_id } } = payload;

    yield call(followerApi.deleteResonator, follower_id, id);

    let followers = yield select(followersSelector);

    let follower = _.find(followers, f => f.id === follower_id);

    followers = _.reject(followers, f => f.id === follower_id)
        .concat({
            ...follower,
            resonators: _.reject(follower.resonators,
                r => r.id === id)
        })

    yield put(updateState({
        followers
    }));
});



handle(types.FILTER_BY_CLINIC_ID, function* (sagaParams, { payload }) {
    yield put(updateState({
        filterByClinicId: payload
    }));
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

    if (!follower)
        yield waitForFollowers();

    follower = yield getFollower(followerId);

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

    let updatedFollower = { ...follower, resonators: updatedResonators };

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

export default { saga, reducer };
