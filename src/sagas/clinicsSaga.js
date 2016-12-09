import SagaReducerFactory from 'SagaReducerFactory';
import { call, put } from 'redux-saga/effects';
import { actions, types } from '../actions/clinicActions';
import { types as sessionActionTypes} from '../actions/sessionActions';
import * as clinicApi from '../api/clinic';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        clinics: []
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function*() {
    let clinics = yield call(clinicApi.get);

    yield put(updateState({
        clinics
    }));
});

export default {saga, reducer};
