import _ from 'lodash';
import SagaReducerFactory from 'saga-reducer-factory';
import { call, put, select } from 'redux-saga/effects';
import { types as sessionActionTypes} from '../actions/sessionActions';
import { actions, types } from '../actions/criteriaActions';
import * as criteriaApi from '../api/criteria';
import {actions as navActions} from '../actions/navigationActions';

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

handle(types.CREATE_CRITERION, function*(sagaParams, {payload}) {
    let criterion = formToCriterion(payload);
    let newCriterion = yield call(criteriaApi.create, criterion.clinic_id, criterion);
    let criteria = yield select(state => state.criteria.criteria);
    yield put(updateState({
        criteria: criteria.concat(newCriterion)
    }));

    yield put(navActions.navigate({
        route: 'criteriaList',
        routeParams: {
            clinicId: criterion.clinic_id
        }
    }));
});

handle(types.UPDATE_CRITERION, function*(sagaParams, {payload}) {
    let criterion = formToCriterion(payload);
    criterion.id = payload.criterionId;
    let updatedCriterion = yield call(criteriaApi.update, criterion.clinic_id, criterion);
    let criteria = yield select(state => state.criteria.criteria);
    criteria = _.reject(criteria, c => c.id === criterion.id).concat(updatedCriterion);

    yield put(updateState({
        criteria
    }));

    yield put(navActions.navigate({
        route: 'criteriaList',
        routeParams: {
            clinicId: criterion.clinic_id
        }
    }));
});

handle(types.DELETE_CRITERION, function*(sagaParams, {payload}) {
    const criteria = yield select(state => state.criteria.criteria);
    const criterionId = payload;
    const clinicId = _.find(criteria, c => c.id === criterionId).clinic_id;

    yield call(criteriaApi.deleteCriterion, clinicId, criterionId);

    yield put(updateState({
        criteria: _.reject(criteria, c => c.id === criterionId)
    }));
});

function formToCriterion(form) {
    let answers = [];

    if (form.question_kind === 'numeric') {
        _.each(form.answers, (v, k) => {
            const key = k.substring(3);

            answers.push({
                rank: parseInt(key),
                body: v
            });
        });
    } else if (form.question_kind === 'boolean') {
        answers.push({
            rank: 0,
            body: form.answers.false
        }, {
            rank: 1,
            body: form.answers.true
        });
    }

    return {
        clinic_id: form.clinic_id,
        description: form.description,
        title: form.title,
        question_kind: form.question_kind,
        answers
    };
}

export default {saga, reducer};
