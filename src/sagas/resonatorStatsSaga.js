import _ from 'lodash';
import SagaReducerFactory from '../saga-reducers-factory-patch';
import { select, call, put } from 'redux-saga/effects';
import { actions, types } from '../actions/resonatorStatsActions.js';
import * as statsApi from '../api/resonatorStats';
import moment from 'moment';

let {handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        stats: {}
    }
});

handle(types.DOWNLOAD_RESONATOR_STATS, function*(sagaParams, {payload}) {
    const {resonatorId} = payload;
    yield call(statsApi.getCsvFile, resonatorId);
});

handle(types.DOWNLOAD_GROUP_STATS, function*(sagaParams, {payload}) {
    const {followerGroupId} = payload;
    yield call(statsApi.getGroupCsvFile, followerGroupId);
});

handle(types.FETCH_RESONATOR_STATS, function*(sagaParams, {payload}) {
    let {resonatorId} = payload;
    let stats = yield select(state => state.resonatorStats.stats);
    let {questions, answers} = yield call(statsApi.get, resonatorId);

    const numericAnswers = answers.filter(a => questions.find(q => q.id === a.question_id).question_kind === 'numeric');
    const numericAnswersPerDay = getUniqueAnswersPerDay(numericAnswers, questions);
    answers = getUniqueAnswersPerDay(answers, questions);

    let averagedChart = averageChart(numericAnswersPerDay, questions);
    let aggregatedChart = aggregateChart(numericAnswersPerDay, questions);

    questions.push(averagedChart.question, aggregatedChart.question);
    answers = answers.concat(averagedChart.answers, aggregatedChart.answers);

    questions.sort((a,b) => a.order - b.order || moment(a.updatedAt) - moment(b.updatedAt));

    let dic = _.reduce(questions, (acc, q) => {
        acc[q.id] = q;
        q.answers.sort((a,b) => a.rank - b.rank);
        acc[q.id].followerAnswers = [];
        acc[q.id].minAnswerRank = _(q.answers).map('rank').min();
        acc[q.id].maxAnswerRank = _(q.answers).map('rank').max();
        return acc;
    }, {});

    _.each(answers.reverse(), a => dic[a.question_id].followerAnswers.push(transformAnswer(a)));

    yield put(updateState({
        stats: {...stats, [resonatorId]: dic}
    }));
});

function aggregateChart(allAnswers, allQuestions) {
    let timeToAnswers = _.reduce(allAnswers, (acc, a) => {
        let time = a.time;
        let time_answered = a.time_answered;
        acc[time] = (acc[time] || []).concat({...a, time, time_answered});
        return acc;
    }, {});

    let aggregatedAnswers = _.reduce(_.keys(timeToAnswers), (acc, time) => {
        let rank = _.sumBy(timeToAnswers[time], a => a.rank);

        acc.push({
            question_id: 'sumAggregation',
            time,
            time_answered:timeToAnswers[time][0].time_answered,
            rank
        });

        return acc;
    }, []);

    let maxRank = _(allQuestions).map('answers').flatten().map('rank').max();

    let question = {
        id: 'sumAggregation',
        title: 'Sum Aggregation',
        answers: [{
            body: '',
            rank: 0
        }, {
            body: '',
            rank: maxRank
        }],
        updatedAt: moment(0).toISOString(),
        order: -1
    };

    return { question, answers: aggregatedAnswers};
}

function averageChart(allAnswers, allQuestions) {
    let timeToAnswers = _.reduce(allAnswers, (acc, a) => {
        let time = a.time;
        let time_answered = a.time_answered;
        acc[time] = (acc[time] || []).concat({...a, time, time_answered});
        return acc;
    }, {});

    let averageAnswers = _.reduce(_.keys(timeToAnswers), (acc, time) => {
        let rank = _.sumBy(timeToAnswers[time], a => a.rank) / timeToAnswers[time].length;

        acc.push({
            question_id: 'average',
            time,
            time_answered:timeToAnswers[time][0].time_answered,
            rank
        });

        return acc;
    }, []);

    let maxRank = _(allQuestions).map('answers').flatten().map('rank').max();

    let question = {
        id: 'average',
        title: 'Average',
        answers: [{
            body: '',
            rank: 0
        }, {
            body: '',
            rank: maxRank
        }],
        updatedAt: moment(0).toISOString(),
        order: -2
    };

    return { question, answers: averageAnswers};
}

function transformAnswer(answer) {
    return {
        time: moment(answer.time).format('D/M/YY HH:mm'),
        time_answered: moment(answer.time_answered).format('D/M/YY HH:mm'),
        rank: answer.rank,
        question_id: answer.question_id,
        followerName: answer.followerName,
        answerBody: answer.answerBody,
        tooltip: answer.tooltip
    };
}

function getUniqueAnswersPerDay(answers) {
    return _(answers)
        .orderBy(a => moment(a.time), ['desc'])
        .sortedUniqBy(a => `${a.question_id}#${moment(a.time).format('D/M/YY HH:mm')}`)
        .value();
}

export default {saga, reducer};
