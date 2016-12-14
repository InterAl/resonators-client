import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/resonatorCreationActions';
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

handle(types.RESET, function*(sagaParams, {payload}) {
    yield put(updateState({
        followerId: payload,
        formData: {}
    }));
});

handle(types.CREATE, function*(sagaParams, {payload}) {
    function convertToPayload(followerId, formData) {
        let repeat_days = _.reduce([
             'day0', 'day1', 'day2', 'day3',
             'day4', 'day5', 'day6'], (acc, cur, idx) => {
            if (formData[cur])
                acc.push(idx);
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

    let formData = yield select(formDataSelector);
    let followerId = yield select(state => state.resonatorCreation.followerId);
    let requestPayload = convertToPayload(followerId, formData);
    let response = yield call(resonatorApi.create, followerId, requestPayload);

    yield put(updateState({
        resonator: response
    }))
});

export default {saga, reducer};
