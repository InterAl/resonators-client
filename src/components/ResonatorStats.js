import _ from 'lodash';
import React, {Component} from 'react';
import {actions as statsActions} from '../actions/resonatorStatsActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Line, Legend} from 'recharts';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import ExpandableCard from './ExpandableCard';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import './ResonatorStats.scss';

class ResonatorStats extends Component {
    static defaultProps = {
        stats: {}
    };

    constructor() {
        super();

        this.renderCard = this.renderCard.bind(this);
    }

    componentWillMount() {
        this.props.fetchResonatorStats({
            resonatorId: this.props.resonatorId
        });
    }

    renderQuestionLegend(question) {
        return (
            <Table style={{width:500, margin: '0 auto', marginTop: 36}}>
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
        return [
            <div style={{height: 500, paddingRight: 30}}>
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
            </div>,
            <ExpandableCard
                id={`resonatorStats_${question.id}_legend`}
                title='Legend'
            >
                {this.renderQuestionLegend(question)}
            </ExpandableCard>
        ];
    }

    renderEmptyState() {
        return (
            <div style={{textAlign: 'center', padding: 20}}>
                No feedback has been given for this criterion.
            </div>
        );
    }

    renderCard(question) {
        return (
            <div className='row' style={{marginBottom: 10}}>
                <ExpandableCard
                    id={`resonatorStats_${question.id}`}
                    title={question.title}
                    subtitle={question.description}
                    width='100%'
                    avatar={<ChartIcon/>}
                >
                    {_.isEmpty(question.followerAnswers) ?
                        this.renderEmptyState() : this.renderChart(question)}
                </ExpandableCard>
            </div>
        )
    }

    render() {
        return <div className='resonator-stats-wrapper'>
                   {_.map(this.props.stats, this.renderCard)}
               </div>
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
