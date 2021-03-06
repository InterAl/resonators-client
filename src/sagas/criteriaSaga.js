import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
import { call, put, select } from 'redux-saga/effects';
import { types as sessionActionTypes} from '../actions/sessionActions';
import { actions, types } from '../actions/criteriaActions';
import * as criteriaApi from '../api/criteria';
import {actions as navActions} from '../actions/navigationActions';
import createSelector from '../selectors/criterionSelector';

let criteriaSelector = state => state.criteria.criteria;

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
    }
});

handle(sessionActionTypes.LOGIN_SUCCESS, function*() {
    const user = yield select((state) => state.session.user);

    if (user.isLeader) {
        const criteria = yield call(criteriaApi.get);

        yield put(updateState({
            criteria
        }));
    }
});

handle(types.ALPHABET_SORT, function*(sagaParams, {payload}) {
   let { alphabetSort } = yield select(state => state.criteria);

   yield put(updateState( { alphabetSort: !alphabetSort }));
});

handle(types.FILTER_TAGS, function*(sagaParams, {payload}){
    let { tagsFilter } = yield select(state => state.criteria);

    if (tagsFilter && tagsFilter.includes(payload)) {
        tagsFilter = _.reject(tagsFilter, (filter) => filter === payload);
        yield put(updateState({ tagsFilter }));
    } else {
        (tagsFilter) ? tagsFilter.push(payload) : tagsFilter = [payload];
        yield put(updateState({ tagsFilter }));
    }
});

handle(types.FILTER_TAGS_ALL, function*(sagaParams, {payload}){
    const { tagsFilter } = yield select(state => state.criteria);

    if (tagsFilter && tagsFilter.length === payload.length) {
        yield put(updateState({ tagsFilter: [] }));
    } else {
        yield put(updateState({ tagsFilter: payload }));
    }
});

handle(types.FILTER_TYPE, function*(sagaParams, {payload}){
    let { typeFilter } = yield select(state => state.criteria);

    if (typeFilter && typeFilter.includes(payload)) {
        typeFilter = _.reject(typeFilter, (filter) => filter === payload);
        yield put(updateState({ typeFilter }));
    } else {
        (typeFilter) ? typeFilter.push(payload) : typeFilter = [payload];
        yield put(updateState({ typeFilter }));
    }
});

handle(types.FILTER_TYPE_ALL, function*(sagaParams, {payload}){
    const { typeFilter } = yield select(state => state.criteria);

    if (typeFilter && typeFilter.length > 0) {
        yield put(updateState({ typeFilter: [] }));
    } else {
        yield put(updateState({ typeFilter: payload }));
    }
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

handle(types.FREEZE, function* (sagaParams, { payload }) {
    yield call(criteriaApi.freezeCriterion, payload);
    const criteria = yield getCriteria(payload);

    const updatedCriterion = {
        ...criteria,
        removed: true
    };

    yield updateStateWithNewCriteria(updatedCriterion);
});

handle(types.TOGGLE_DISPLAY_FROZEN, function* (sagaParams, { payload }) {
    const { displayFrozen } = yield select(state => state.criteria);

    yield put(updateState({
        displayFrozen: !displayFrozen
    }));
});

handle(types.UNFREEZE, function* (sagaParams, { payload }) {
    yield call(criteriaApi.unfreezeCriterion, payload);
    const criteria = yield getCriteria(payload);

    const updatedCriterion = {
        ...criteria,
        removed: false
    };

    yield updateStateWithNewCriteria(updatedCriterion);
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

function* updateStateWithNewCriteria(criteria) {
    let lastCriteria = yield select(criteriaSelector);

    yield put(updateState({
        criteria:  _.reject(lastCriteria, c => c.id === criteria.id)
        .concat(criteria)
    }));

}

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
        tags: form.tags,
        is_system: form.is_system,
        answers
    };
}

function* getCriteria(id) {
    let criterions = yield select(criteriaSelector);
    return _.find(criterions, c => c.id === id);
}

export default {saga, reducer};
