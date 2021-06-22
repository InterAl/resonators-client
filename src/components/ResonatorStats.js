import _ from 'lodash';
import React, { Component } from 'react';
import { actions as statsActions } from '../actions/resonatorStatsActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend } from 'recharts';
import { TableContainer, Table, TableBody, TableRow, TableCell, Typography } from '@material-ui/core';
import { InsertChart } from '@material-ui/icons';
import ExpandableCard from './ExpandableCard';
import './ResonatorStats.scss';

const CustomTooltip = ({active, payload, label}) => {
    if (active) {
        return (
            <div className="custom_tooltip">
                {payload[0].payload.tooltip && <p>{payload[0].payload.tooltip}</p>}
                <p>Time Answered: {payload[0].payload.time_answered}</p>
                <p>Rank: {payload[0].payload.rank}</p>
            </div>
        );
    }
    return null;
};

class ResonatorStats extends Component {
    static defaultProps = {
        stats: {}
    };

    constructor() {
        super();

        this.renderCard = this.renderCard.bind(this);
    }

    componentWillMount() {
        if (this.props.resonatorId) {
            this.props.fetchResonatorStats({
                resonatorId: this.props.resonatorId
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.resonatorId && this.props.resonatorId !== prevProps.resonatorId)
            this.props.fetchResonatorStats({
                resonatorId: this.props.resonatorId
            });
    }
    renderQuestionLegend(question) {
        return (
            <TableContainer>
                <Table style={{ width: 500, margin: '0 auto', marginTop: 36 }}>
                    <TableBody>
                        {_.map(question.answers, (a) => (
                            <TableRow key={a.id}>
                                <TableCell>
                                    {a.rank}
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'normal', textOverflow: 'inherit' }}>
                                    {a.body}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    renderChart(question) {
        return [
            <div key="chart" style={{ height: 500, paddingRight: 30 }}>
                <ResponsiveContainer>
                    <LineChart data={question.followerAnswers}>
                        <XAxis dataKey="time" />
                        <YAxis tick={true} domain={[question.minAnswerRank, question.maxAnswerRank]} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                        <Line type="linear" dataKey="rank" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>,
            <ExpandableCard
                id={`resonatorStats_${question.id}_legend`}
                title='Legend'
                key="card"
            >
                {this.renderQuestionLegend(question)}
            </ExpandableCard>
        ];
    }

    renderTypography(text) {
        return (
            <Typography style={{ textAlign: 'center', padding: 20 }}>
                {text}
            </Typography>
        );
    }

    renderCard(question) {
        return (
            <ExpandableCard
                id={`resonatorStats_${question.id}`}
                title={question.title}
                subtitle={question.description}
                avatar={<InsertChart />}
                key={question.id}
                style={{ marginBottom: 10, minWidth: "100%" }}
            >
                {_.isEmpty(question.followerAnswers) ?
                    this.renderTypography('No feedback has been given for this criterion.') : this.renderChart(question)}
            </ExpandableCard>
        )
    }

    formatStats(stats) {
        return _.reduce(stats, (acc, { followerAnswers, ...stat }) => ({
                ...acc,
                [stat.id]: {
                    ...stat,
                    followerAnswers:
                        _(followerAnswers)
                            .groupBy(({ time }) =>
                                time.split(' ')[0])
                            .map(this.getSumByDay)
                            .value(),
                },
            }), {});
    }

    getSumByDay(stats) {
        return stats.reduce((acc, next) => ({
            time: next.time.split(' ')[0].concat(' 00:00'),
            time_answered: next.time_answered,
            rank: acc.rank + next.rank,
            question_id: next.question_id,
        }));
    }

    render() {
        const formattedStats = this.props.followerGroup ?
            this.formatStats(this.props.stats) :
            this.props.stats;
        const stats = _.map(formattedStats, this.renderCard);

        return (
            <React.Fragment>
                <div className='resonator-stats-wrapper'>
                        {stats || this.renderTypography('No stats are available.')}
                </div>
            </React.Fragment>

        );
    }
}

function mapStateToProps(state, ownProps) {
    let stats = state.resonatorStats.stats[ownProps.resonatorId];

    return {
        stats
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchResonatorStats: statsActions.fetchResonatorStats
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResonatorStats);
