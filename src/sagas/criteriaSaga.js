// import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
import { call, put } from 'redux-saga/effects';
import { actions, types } from '../actions/resonatorActions';
import { types as sessionActionTypes} from '../actions/sessionActions';
import * as criteriaApi from '../api/criteria';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function*() {
    let criteria = yield call(criteriaApi.get);

    yield put(updateState({
        criteria
    }));
});


export default {saga, reducer};
