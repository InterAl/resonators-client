import SagaReducerFactory from 'SagaReducerFactory';
import { actions, types } from '../actions/sessionActions';
import * as sessionApi from '../api/session';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {}
});

handle(types.LOGIN, function*(sagaParams, action) {
    let {email, password} = action.payload;

    let user = yield call(sessionApi.create(email, password));

    yield updateState({
        user
    });
});

export default {saga, reducer};
