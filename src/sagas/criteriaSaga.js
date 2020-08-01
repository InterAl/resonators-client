import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
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
    const formAnswersEmpty = _.isEmpty(_.keys(form.answers));

    if (form.question_kind === 'numeric') {
        if (!formAnswersEmpty) {
            const rankMap = _.reduce(form.answers, (acc, v, k) => {
                const key = k.substring(3);
                const rank = parseInt(key);
                if (!isNaN(rank)) {
                    acc[rank] = {
                        rank,
                        body: v
                    };
                }
                return acc;
            }, {});

            const ranks = _.values(rankMap).map(a => a.rank);

            const hasMissingAnswers = ranks[1] - ranks[0] > 1;

            //fill missing answers
            if (hasMissingAnswers) {
                _.each(_.range(ranks[0] + 1, ranks[1]), rank => {
                    rankMap[rank] = {rank, body: ''};
                });
            }

            answers = _.values(rankMap);
        } else {
            _.each(_.range(parseInt(form.numMin), parseInt(form.numMax) + 1),
                   rank => answers.push({ rank, body: ''}));
        }
    } else if (form.question_kind === 'boolean') {
        if (!formAnswersEmpty) {
            answers.push({
                rank: 0,
                body: form.answers.false
            }, {
                rank: 1,
                body: form.answers.true
            });
        } else {
            answers.push({
                rank: 0,
                body: 'No'
            }, {
                rank: 1,
                body: 'Yes'
            });
        }
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
