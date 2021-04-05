import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put } from 'redux-saga/effects';
import * as googlePhotosApi from '../api/googlePhotos';
import * as googleContactsApi from '../api/googleContacts';
import {types as sessionActionTypes} from "actions/sessionActions";
import {actions, types} from "actions/googleDataActions";

let { handle, updateState, saga, reducer } = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        googlePhotos: [],
        googleContacts: []
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function* () {
    const googlePhotos = yield call(googlePhotosApi.get);
    const googleSystemPhotos = yield call(googlePhotosApi.getSystem);
    const googleContacts = yield call(googleContactsApi.get);

    yield put(updateState({
        googlePhotos,
        googleSystemPhotos,
        googleContacts
    }));
});

export default { saga, reducer };
