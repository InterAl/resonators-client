import SagaReducerFactory from 'SagaReducerFactory';
import { put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/menuActions';
import {browserHistory} from 'react-router';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        menu: {
            'clinic': {
                route: '/react/clinic'
            }
        },
        isOpen: false
    }
});

handle(types.TOGGLE_MENU, function*() {
    let isOpen = yield select(state => state.menu.isOpen);

    yield put(updateState({
        isOpen: !isOpen
    }));
});

export default {saga, reducer};
