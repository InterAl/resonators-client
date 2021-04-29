import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put, select, take } from 'redux-saga/effects';
import { actions, types } from '../actions/followerGroupsActions';
import { types as resonatorTypes } from '../actions/groupResonatorActions';
import { types as sessionActionTypes } from '../actions/sessionActions';
import * as followerGroupApi from '../api/followerGroup';
import resonatorsSelector from '../selectors/resonatorsSelector';


const followerGroupsSelector = state => state.followerGroups.followerGroups;

const { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        followerGroups: [],
        filterByClinicId: 'all'
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function* () {
    const user = yield select((state) => state.session.user);

    if (user.isLeader) {
        const followerGroups = yield call(followerGroupApi.get);

        yield put(updateState({
            followerGroups,
        }));
    }
});

handle(types.CREATE, function* (sagaParams, { payload }) {
    const followerGroup = yield call(followerGroupApi.create, payload);

    yield updateStateWithNewFollowerGroup(followerGroup);
});

handle(types.DELETE, function* (sagaParams, { payload }) {
    yield call(followerGroupApi.deleteFollowerGroup, payload);
    const followerGroups = yield select(followerGroupsSelector);
    const followerGroupsWithoutDeleted = _.reject(followerGroups, (fg) => fg.id === payload);

    yield put(updateState({
        followerGroups: followerGroupsWithoutDeleted
    }));
});

handle(types.FREEZE, function* (sagaParams, { payload }) {
    yield call(followerGroupApi.freezeFollowerGroup, payload);
    const followerGroup = yield getFollowerGroup(payload);

    const updatedFollowerGroup = {
        ...followerGroup,
        frozen: true
    };

    yield updateStateWithNewFollowerGroup(updatedFollowerGroup);
});

handle(types.UNFREEZE, function* (sagaParams, { payload }) {
    yield call(followerGroupApi.unfreezeFollowerGroup, payload);
    const followerGroups = yield select(followerGroupsSelector);
    const followerGroup = yield getFollowerGroup(payload);

    const updatedFollowerGroup = {
        ...followerGroup,
        frozen: false
    };

    yield updateStateWithNewFollowerGroup(updatedFollowerGroup);
});

handle(types.TOGGLE_DISPLAY_FROZEN, function* (sagaParams, { payload }) {
    const { displayFrozen } = yield select(state => state.followerGroups);

    yield put(updateState({
        displayFrozen: !displayFrozen
    }));
});

handle(types.UPDATE, function* (sagaParams, { payload }) {
    yield call(followerGroupApi.edit, payload);
    const followerGroup = yield getFollowerGroup(payload.id);

    const updatedFollowerGroup = {
        ...followerGroup,
        ...payload,
    };

    yield updateStateWithNewFollowerGroup(updatedFollowerGroup);
});

handle(types.UPDATE_FOLLOWER_GROUP_MEMBERS, function* (sagaParams, { payload }) {
    const { newMemberList, followerGroupId } = payload;
    const members = newMemberList.filter((m) => typeof m !== "undefined");
    yield call(followerGroupApi.updateMembers, followerGroupId, members.map(({ id }) => id));
    const followerGroup = yield getFollowerGroup(followerGroupId);

    const updatedFollowerGroup = {
        ...followerGroup,
        members: newMemberList,
        memberCount: newMemberList.length,
    };

    yield updateStateWithNewFollowerGroup(updatedFollowerGroup);
});


handle(types.FETCH_FOLLOWER_GROUP_MEMBERS, function* (sagaParams, { payload }) {
    yield fetchFollowerGroupMembers(payload);
});

handle(types.FETCH_FOLLOWER_GROUP_RESONATORS, function* (sagaParams, { payload }) {
    yield fetchFollowerGroupResonators(payload);
});

handle(types.FETCH_MEMBERS_WITH_RESONATOR_CHILDREN, function* (sagaParams, { payload }) {
    yield fetchMembersWithResonatorChildren(payload);
});

handle(resonatorTypes.REMOVE, function* (sagaParams, { payload }) {
    const { resonator: { id, follower_group_id } } = payload;

    yield call(followerGroupApi.deleteGroupResonator, follower_group_id, id);

    const followerGroups = yield select(followerGroupsSelector);

    const followerGroup = _.find(followerGroups, (fg) => fg.id === follower_group_id);

    const updatedFollowerGroups = _.reject(followerGroups, (fg) => fg.id === follower_group_id)
        .concat({
            ...followerGroup,
            resonators: _.reject(followerGroup.resonators,
                r => r.id === id)
        })

    yield put(updateState({
        followerGroups: updatedFollowerGroups,
    }));
});



handle(types.FILTER_BY_CLINIC_ID, function* (sagaParams, { payload }) {
    yield put(updateState({
        filterByClinicId: payload
    }));
});

export function* waitForFollowerGroups() {
    let followerGroups;

    do {
        followerGroups = yield select(followerGroupsSelector);
        if (followerGroups.length > 0)
            break;
        else
            yield take('*');
    } while (followerGroups.length === 0)
}

export function* fetchFollowerGroupMembers(followerGroupId) {
    let followerGroup = yield getFollowerGroup(followerGroupId);

    if (!followerGroup)
        yield waitForFollowerGroups();

    followerGroup = yield getFollowerGroup(followerGroupId);
    const followerGroupMembers = yield call(followerGroupApi.getGroupMembers, followerGroupId);

    const patchedFollowerGroup = {
        ...followerGroup,
        members: followerGroupMembers
    };

    yield updateStateWithNewFollowerGroup(patchedFollowerGroup);
}

export function* fetchFollowerGroupResonators(followerGroupId) {
    let followerGroup = yield getFollowerGroup(followerGroupId);

    if (!followerGroup)
        yield waitForFollowerGroups();

    followerGroup = yield getFollowerGroup(followerGroupId);

    const followerGroupResonators = yield call(followerGroupApi.getGroupResonators, followerGroupId);

    const patchedFollowerGroup = {
        ...followerGroup,
        resonators: followerGroupResonators
    };

    yield updateStateWithNewFollowerGroup(patchedFollowerGroup);
}

export function* fetchMembersWithResonatorChildren({ followerGroupId, resonatorId }) {
    yield fetchFollowerGroupMembers(followerGroupId);

    const followerGroup = yield getFollowerGroup(followerGroupId);
    const resonators = yield select(resonatorsSelector);
    const resonator = _.find(resonators, (r) => r.id === resonatorId);
    const childResonators = yield call(followerGroupApi.getGroupResonatorChildren, followerGroupId, resonatorId);
    const patchedFollowerGroup = {
        ...followerGroup,
        resonators: _.reject(followerGroup.resonators, (r) => r.id === resonatorId)
            .concat({ ...resonator, childResonators }),
    };

    yield updateStateWithNewFollowerGroup(patchedFollowerGroup);
}

function* updateStateWithNewFollowerGroup(followerGroup) {
    let lastFollowerGroups = yield select(followerGroupsSelector);

    let followerGroups = _.reject(lastFollowerGroups, fg => fg.id === followerGroup.id)
        .concat(followerGroup);

    yield put(updateState({
        followerGroups
    }));
}

export function* updateGroupResonator(followerGroupId, resonator) {
    let followerGroups = yield select(followerGroupsSelector);

    let followerGroup = _.find(followerGroups, fg => fg.id === followerGroupId);

    let updatedResonators = _.reject(followerGroup.resonators, r => r.id === resonator.id)
        .concat(resonator);

    let updatedFollowerGroup = { ...followerGroup, resonators: updatedResonators };

    let updatedFollowerGroups = _.reject(followerGroups, fg => fg.id === followerGroupId)
        .concat(updatedFollowerGroup);

    yield put(updateState({
        followerGroups: updatedFollowerGroups
    }));
}

function* getFollowerGroup(id) {
    let followerGroups = yield select(followerGroupsSelector);
    return _.find(followerGroups, fg => fg.id === id);
}

export default { saga, reducer };
