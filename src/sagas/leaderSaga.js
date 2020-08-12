import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/leaderActions';
import { types as sessionActionTypes} from '../actions/sessionActions';
import * as leaderApi from '../api/leader';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        leaders: []
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function*() {
    const user = yield select((state) => state.session.user);

    if (user.isLeader) {
        const leaders = yield call(leaderApi.get);
     
         yield put(updateState({
             leaders
         }));
    }
});
export default {saga, reducer};
