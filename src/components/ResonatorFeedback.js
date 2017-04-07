import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actions} from '../actions/feedbackActions';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import React, {Component} from 'react';

class ResonatorFeedback extends Component {
    constructor(props) {
        super(props);

        this.renderQuestion = this.renderQuestion.bind(this);
        this.renderAnswer = this.renderAnswer.bind(this);
        this.handleAnswerClick = this.handleAnswerClick.bind(this);
    }

    handleAnswerClick(questionId, answerId) {
        this.props.sendAnswer({
            questionId,
            answerId
        });
    }

    renderAnswer(q, a, idx) {
        let label;

        if (q.question_kind  === 'numeric') {
            if (!a.body) {
                label = a.rank;
            } else {
                label = `${a.rank} - ${a.body}`;
            }
        } else {
            label = a.body;
        }

        return (
            <div key={`${q.id}#${a.id}`}>
                <RaisedButton
                    primary
                    key={idx}
                    label={label}
                    onClick={() => this.handleAnswerClick(q.id, a.id)}
                    style={{ marginBottom: 30 }}
                />
            </div>
        );
    }

    renderQuestion(q) {
        const {question} = q;
        const answers = _.orderBy(question.answers, a => a.rank);

        return (
            <Card key={q.id}>
                <CardHeader
                    title={question.description}
                />
                <CardText>
                    {_.map(answers, a => this.renderAnswer(question, a))}
                </CardText>
            </Card>
        );
    }

    renderDone() {
        return (
            <Card key='done'>
                <CardText>
                    Your feedback was successfully recorded.
                </CardText>
            </Card>
        );
    }

    render() {
        const {question} = this.props;

        return (
            <div className='row' style={{'display': 'flex', width: '100%', marginTop: 30}}>
                <div className='center-block'>
                    {question ? this.renderQuestion(question) :
                                this.renderDone()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {resonator, answered, currentQuestionIdx} = state.resonatorFeedback;
    const question = resonator.questions[currentQuestionIdx];

    return {resonator, answered, question};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        sendAnswer: actions.sendAnswer
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResonatorFeedback);
