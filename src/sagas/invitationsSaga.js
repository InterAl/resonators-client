import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/invitationsActions';
import * as invitationApi from '../api/invitation';
import {types as sessionActionTypes} from "actions/sessionActions";

let invitationsSelector = state => state.invitations.invitations;

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        invitations: []
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function* () {
    const user = yield select((state) => state.session.user);

    if (user.isLeader) {
        const invitations = yield call(invitationApi.get);

        yield put(updateState({
            invitations
        }));
    }
});

handle(types.CREATE, function* (sagaParams, { payload }) {
    let invite = yield call(invitationApi.create, payload);

    yield updateStateWithNewInvitation(invite);
});

handle(types.DELETE, function* (sagaParams, { payload }) {
    yield call(invitationApi.deleteInvitation, payload);
    let invitations = yield select(invitationsSelector);
    let invitationsWithoutDeleted = _.reject(invitations, i => i.id === payload);

    yield put(updateState({
        invitations: invitationsWithoutDeleted
    }));
});

handle(types.UPDATE, function* (sagaParams, { payload }) {
    yield call(invitationApi.edit, payload);
    let invitation = yield getInvitation(payload.id);
    let updatedInvitation = {
        ...invitation,
        subject: payload.subject,
        body: payload.body
    };

    yield updateStateWithNewInvitation(updatedInvitation);
});

function* updateStateWithNewInvitation(invitation) {
    let lastInvitations = yield select(invitationsSelector);

    let invitations = _.reject(lastInvitations, i => i.id === invitation.id)
        .concat(invitation);

    yield put(updateState({
        invitations
    }));
}

function* getInvitation(id) {
    let invitations = yield select(invitationsSelector);
    return _.find(invitations, i => i.id === id);
}

export default { saga, reducer };
