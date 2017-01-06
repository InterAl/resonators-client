import SagaReducerFactory from 'saga-reducer-factory';
import { put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/menuActions';
import { actions as sessionActions} from '../actions/sessionActions';
import {actions as navigationActions} from '../actions/navigationActions';

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

handle(types.CLICK_MENU_ITEM, function*(sagaParams, {payload}) {
    if (payload === 'logout') {
        yield put(sessionActions.logout());
    } else {
        yield put(navigationActions.navigate(payload));
    }

    yield put(actions.toggleMenu());
});

export default {saga, reducer};
