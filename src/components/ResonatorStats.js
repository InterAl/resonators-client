import _ from 'lodash';
import React, {Component} from 'react';
import {actions as statsActions} from '../actions/resonatorStatsActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend} from 'recharts';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import './ResonatorStats.scss';

class ResonatorStats extends Component {
    static defaultProps = {
        stats: {}
    };

    constructor() {
        super();

        this.renderChart = this.renderChart.bind(this);
    }

    componentWillMount() {
        this.props.fetchResonatorStats({
            resonatorId: this.props.params.resonatorId
        });
    }

    renderQuestionLegend(question) {
        return (
            <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn colSpan='2'
                            style={{whiteSpace: 'normal', textOverflow: 'inherit', paddingBottom: 10}}>
                            <b>{question.title}</b><br/>
                            <br/>
                            {question.description}
                        </TableHeaderColumn>
                    </TableRow>
                    <TableRow>
                        <TableHeaderColumn>
                            Rank
                        </TableHeaderColumn>
                        <TableHeaderColumn>
                            Answer
                        </TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {_.map(question.answers, a => (
                        <TableRow>
                            <TableRowColumn>
                                {a.rank}
                            </TableRowColumn>
                            <TableRowColumn style={{whiteSpace: 'normal', textOverflow: 'inherit'}}>
                                {a.body}
                            </TableRowColumn>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    renderChart(question) {
        return (
            <div className='resonator-stats-chart row'>
                <div className='col-sm-2'>
                    {this.renderQuestionLegend(question)}
                </div>
                <div className='col-sm-10' style={{height: 400}}>
                    <ResponsiveContainer>
                        <LineChart data={question.followerAnswers}>
                            <XAxis dataKey="time"/>
                            <YAxis tick={true} domain={[question.minAnswerRank, question.maxAnswerRank]}/>
                            <Tooltip/>
                            <Legend/>
                            <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                            <Line type="linear" dataKey="rank" stroke="#82ca9d" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }

    render() {
        return <div className='resonator-stats-wrapper'>
                   {_.map(this.props.stats, this.renderChart)}
               </div>
    }
}

function mapStateToProps(state, ownProps) {
    let {resonatorId, qid} = ownProps.params;

    let resonatorStats = state.resonatorStats.stats[resonatorId];

    let filteredQuestions = _(resonatorStats)
                                .map((q, qid) => ({q, qid}))
                                .filter(q => qid === 'all' || q.qid === qid)
                                .map(q => q.q)
                                .value();

    return {
        stats: filteredQuestions
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchResonatorStats: statsActions.fetchResonatorStats
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResonatorStats);
