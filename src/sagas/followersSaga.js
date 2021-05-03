import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put, select, take } from 'redux-saga/effects';
import { actions, types } from '../actions/followersActions';
import { types as resonatorTypes } from '../actions/resonatorActions';
import * as followerApi from '../api/follower';

let followersSelector = state => state.followers.followers;
let systemFollowersSelector = state => state.followers.systemFollowers;

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        followers: [],
        systemFollowers: [],
        filterByClinicId: 'all'
    }
});

handle(types.FETCH, function* () {
    const user = yield select((state) => state.session.user);

    if (user.isLeader) {
        yield fetchFollowers();
    }
});

handle(types.CREATE, function* (sagaParams, { payload }) {
    let follower = yield call(followerApi.create, payload);

    follower.user.email = payload.email;
    yield updateStateWithNewFollower(follower);
});

handle(types.DELETE, function* (sagaParams, { payload }) {
    yield call(followerApi.deleteFollower, payload);
    let followers = yield select(followersSelector);
    let systemFollowers = yield select(systemFollowersSelector);
    let followersWithoutDeleted = _.reject(followers, f => f.id === payload);
    let systemFollowersWithoutDeleted = _.reject(systemFollowers, f => f.id === payload);

    yield put(updateState({
        followers: followersWithoutDeleted,
        systemFollowers: systemFollowersWithoutDeleted
    }));
});

handle(types.FILTER_GROUPS, function* (sagaParams, {payload}){
    let { groupsFilter } = yield select(state => state.followers);

    if (groupsFilter && groupsFilter.includes(payload)) {
        groupsFilter = _.reject(groupsFilter, (filter) => filter === payload);
        yield put(updateState({ groupsFilter }));
    } else {
        (groupsFilter) ? groupsFilter.push(payload) : groupsFilter = [payload];
        yield put(updateState({ groupsFilter }));
    }
});

handle(types.FILTER_GROUPS_ALL, function* (sagaParams, {payload}){
    const { groupsFilter } = yield select(state => state.followers);

    if (groupsFilter && groupsFilter.length > 0) {
        yield put(updateState({ groupsFilter: [] }));
    } else {
        yield put(updateState({ groupsFilter: payload }));
    }
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
    let systemFollowers = yield select(systemFollowersSelector);

    let follower = _.find(followers, f => f.id === follower_id) || _.find(systemFollowers, f => f.id === follower_id);

    followers = _.reject(followers, f => f.id === follower_id)
        .concat({
            ...follower,
            resonators: _.reject(follower.resonators,
                r => r.id === id)
        })

    yield put(updateState({
        followers,
        systemFollowers
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


    const followerResonators = yield call(followerApi.getResonators, followerId);

    const patchedFollower = {
        ...follower,
        resonators: followerResonators
    };

    yield updateStateWithNewFollower(patchedFollower);
}

function* updateStateWithNewFollower(follower) {
    if (follower.is_system) {
        const lastSystemFollowers = yield select(systemFollowersSelector);
        const systemFollowers = _.reject(lastSystemFollowers, f => f.id === follower.id).concat(follower);
        yield put(updateState({systemFollowers}));
    } else {
        const lastFollowers = yield select(followersSelector);
        const followers = _.reject(lastFollowers, f => f.id === follower.id).concat(follower);
        yield put(updateState({followers}));
    }
}

export function* updateResonator(followerId, resonator) {
    let followers = yield select(followersSelector);
    let systemFollowers = yield select(systemFollowersSelector);

    let follower = _.find(followers, f => f.id === followerId) || _.find(systemFollowers, f => f.id === followerId);

    let updatedResonators = _.reject(follower.resonators, r => r.id === resonator.id)
        .concat(resonator);

    let updatedFollower = { ...follower, resonators: updatedResonators };

    let updatedFollowers = _.reject(followers, f => f.id === followerId).concat(updatedFollower);
    let updatedSystemFollowers = _.reject(systemFollowers, f => f.id === followerId).concat(updatedFollower);

    yield put(updateState({followers: updatedFollowers, systemFollowers: updatedSystemFollowers}));
}

function* fetchFollowers() {
    const followers = yield call(followerApi.get);
    const systemFollowers = yield call(followerApi.getSystemFollowers);

    yield put(updateState({
        followers,
        systemFollowers
    }));
}

function* getFollower(id) {
    let followers = yield select(followersSelector);
    let systemFollowers = yield select(systemFollowersSelector);

    return _.find(followers, f => f.id === id) || _.find(systemFollowers, f => f.id === id);
}

export default { saga, reducer };
