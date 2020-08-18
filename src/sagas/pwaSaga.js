import { put } from "redux-saga/effects";
import { actions, types } from "../actions/pwaActions";
import SagaReducerFactory from "../saga-reducers-factory-patch";

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        installPrompt: null,
    },
});

handle(types.REGISTER_INSTALL_PROMPT, function* (sagaParams, { payload }) {
    yield put(
        updateState({
            installPrompt: payload,
        })
    );
});

handle(types.APP_INSTALLED, function* () {
    yield put(
        updateState({
            installPrompt: null,
        })
    );
});

export default { saga, reducer };
