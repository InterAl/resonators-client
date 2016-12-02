import SagaReducerFactory from 'SagaReducerFactory';
import { actions, types } from '../actions/initActions';

let {handle, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {}
});

handle(types.INIT_APP, function*() {
    let x = 5;
    console.log('i\'m in the zone!');
});

export default {saga, reducer};
