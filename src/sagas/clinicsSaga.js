import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/clinicActions';
import { types as sessionActionTypes} from '../actions/sessionActions';
import { types as leaderClinicActiontypes} from '../actions/leaderClinicsActions';
import * as clinicApi from '../api/clinic';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        clinics: []
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function*() {
    const user = yield select(state => state.session.user);

    if (user.isLeader) {
        const clinics = yield call(clinicApi.get);
    
        yield put(updateState({
            clinics
        }));
    }
});
handle(leaderClinicActiontypes.CREATE, function* (sagaParams, { payload }) {
    yield call(clinicApi.addLeaderToClinic, payload);
});
export default {saga, reducer};
