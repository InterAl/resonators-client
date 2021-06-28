import SagaReducerFactory from '../saga-reducers-factory-patch';
import {call, put, select} from 'redux-saga/effects';
import { actions, types } from '../actions/clinicSettingsActions';
import * as clinicApi from '../api/clinic';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        formData: {},
        activeClinic: {}
    }
});

const formDataSelector = state => state.clinicSettings.formData;
const clinicsSelector = state => state.clinics.clinics;

handle(types.UPDATE_FORM, function* (sagaParams, { payload }) {
    const currentFormData = yield select(formDataSelector);
    const clinics = yield select(clinicsSelector);
    const activeClinic = clinics.find(c => c.is_primary === true);
    if (!activeClinic) return false;

    if (payload.logo || payload.logo === null) activeClinic.logo = payload.logo;
    if (payload.therapistPicture || payload.therapistPicture === null) activeClinic.therapistPicture = payload.therapistPicture;
    if (payload.QRImage || payload.QRImage === null) activeClinic.qr = payload.QRImage;
    if (typeof payload.phone !== "undefined") activeClinic.phone = payload.phone;
    if (typeof payload.website !== "undefined") activeClinic.website = payload.website;
    if (typeof payload.therapistName !== "undefined") activeClinic.therapistName = payload.therapistName;
    if (typeof payload.name !== "undefined") activeClinic.name = payload.name;

    yield put(updateState({
        formData: {
            ...currentFormData,
            ...payload
        },
        activeClinic
    }));
});

handle(types.SAVE, function* (sagaParams, { payload }) {
    const currentFormData = yield select(formDataSelector);
    yield call(clinicApi.saveSettings, currentFormData);
});
export default {saga, reducer};
