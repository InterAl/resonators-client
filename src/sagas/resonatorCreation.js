import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
import { put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/resonatorActions';
import resonatorApi from '../api/resonator';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        formData: null,
        resonator: null
    }
});

handle(types.UPDATE_CREATION_STEP, function*(sagaParams, {payload}) {
    let formData = yield select(state => state.resonatorCreation.formData);

    yield put(updateState({
        formData: {
            ...formData,
            ...payload
        }
    }));
});

handle(types.CREATE, function*(sagaParams, {payload}) {
    yield put(updateState({
        resonator: {}
    }));
});

export default {saga, reducer};
