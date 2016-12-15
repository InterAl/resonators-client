import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/resonatorCreationActions';
import resonatorsSelector from '../selectors/resonatorsSelector';
import * as resonatorApi from '../api/resonator';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        formData: {},
        resonator: null
    }
});

const formDataSelector = state => state.resonatorCreation.formData;

handle(types.UPDATE_CREATION_STEP, function*(sagaParams, {payload}) {
    let formData = yield select(formDataSelector);

    yield put(updateState({
        formData: {
            ...formData,
            ...payload
        }
    }));
});

handle(types.UPDATE_FINAL, function*(sagaParams, {payload}) {
});

handle(types.RESET, function*(sagaParams, {payload: {followerId, resonatorId}}) {
    let resonators = yield select(resonatorsSelector);
    let resonator = _.find(resonators, r => r.id === resonatorId);
    let formData = resonator ? convertResonatorToForm(resonator) : {};

    yield put(updateState({
        followerId,
        formData
    }));
});

handle(types.CREATE, function*(sagaParams, {payload}) {
    let formData = yield select(formDataSelector);
    let followerId = yield select(state => state.resonatorCreation.followerId);
    let requestPayload = convertToPayload(followerId, formData);
    let response = yield call(resonatorApi.create, followerId, requestPayload);

    yield put(updateState({
        resonator: response
    }))
});

function convertFormToPayload(followerId, formData) {
    let repeat_days = _.reduce([0,1,2,3,4,5,6] , (acc, cur) => {
        if (formData[`day${cur}`])
            acc.push(cur);
        return acc;
     }, []);

    let payload = {
        follower_id: followerId,
        title: formData.title,
        content: formData.description,
        repeat_days,
        disable_copy_to_leader: !!!formData.sendMeCopy,
        link: formData.link,
        pop_email: !!formData.activated,
        pop_time: formData.time.toISOString(),
    };

    return payload;
}

function convertResonatorToForm(resonator) {
    let repeatDays = _.reduce([0,1,2,3,4,5,6], (acc, cur) => {
         acc[`day${cur}`] = _.includes(resonator.repeat_days, cur);
         return acc;
     }, {});

    let form = {
        ...repeatDays,
        title: resonator.title,
        description: resonator.content,
        sendMeCopy: !!!resonator.disable_copy_to_leader,
        link: resonator.link,
        activated: !!resonator.pop_email,
        time: new Date(resonator.pop_time)
    }

    return form;
}

export default {saga, reducer};
