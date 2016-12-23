import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
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

handle(types.FETCH_RESONATOR_STATS, function*(sagaParams, {payload}) {
    let {resonatorId} = payload;
    let stats = yield select(state => state.resonatorStats.stats);
    let {questions, answers} = yield call(statsApi.get, resonatorId);

    let aggregatedChart = aggregateChart(answers);
    questions.push(aggregatedChart.question);
    answers = answers.concat(aggregatedChart.answers);
    // debugger

    questions.sort((a,b) => moment(a.updated_at) - moment(b.updated_at));

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

function aggregateChart(allAnswers) {
    let timeToAnswers = _.reduce(allAnswers, (acc, a) => {
        let time = moment(a.time).format('YYYY-MM-DD');
        acc[time] = (acc[time] || []).concat({...a, time});
        return acc;
    }, {});

    let aggregatedAnswers = _.reduce(_.keys(timeToAnswers), (acc, time) => {
        let rank = _.sumBy(timeToAnswers[time], a => a.rank);

        acc.push({
            question_id: 'sumAggregation',
            time,
            rank,
        });

        return acc;
    }, []);

    let ranks = _.map(aggregatedAnswers, a => a.rank);

    let question = {
        id: 'sumAggregation',
        title: 'Sum Aggregation',
        answers: [{
            body: '',
            rank: _.min(ranks)
        }, {
            body: '',
            rank: _.max(ranks)
        }],
        updated_at: moment(0).toISOString()
    };

    return { question, answers: aggregatedAnswers};
}

function transformAnswer(answer) {
    return {
        time: moment(answer.time).format('D/M/YY'),
        rank: answer.rank,
        question_id: answer.question_id
    };
}

export default {saga, reducer};
