import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actions} from '../actions/feedbackActions';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './ResonatorFeedback.cssmodule.scss';
import React, {Component} from 'react';
import classNames from 'classnames';

class ResonatorFeedback extends Component {
    constructor(props) {
        super(props);

        this.renderQuestion = this.renderQuestion.bind(this);
        this.renderAnswer = this.renderAnswer.bind(this);
        this.handleAnswerClick = this.handleAnswerClick.bind(this);
    }

    shouldDisplayRtl() {
        function isHebrewLetter(letter) {
            const code = letter.charCodeAt(0);
            return code === 32 || code >= 1488 && code <= 1514;
        }

        const text = _.get(this.props, 'question.question.title', '');
        const textArr = text.split('');

        const hebrewLettersCount = _.reduce(textArr, (acc, letter) => {
            return acc + (isHebrewLetter(letter) ? 1 : 0);
        }, 0);

        const isHebrew = hebrewLettersCount / textArr.length > 0.5;
        return isHebrew;
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

    renderQuestionDescription(description) {
        const total = this.props.questionsCount - 1;
        const current = total - this.props.currentQuestionIdx;

        return (
            <div>
                <div className={styles.questionDescriptionCount}>
                    {`(${current} / ${total})`}
                </div>

                {description}
            </div>
        );
    }

    renderQuestion(q) {
        const {question} = q;
        const answers = _.orderBy(question.answers, a => a.rank);
        const rtl = this.shouldDisplayRtl();

        return (
            <Card key={q.id}>
                <CardHeader
                    className={
                        classNames({
                            [styles.questionDescriptionRtl]: rtl,
                            [styles.questionDescriptionLtr]: !rtl
                        })
                    }
                    title={this.renderQuestionDescription(question.description)}
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
            <div className='row' style={{
                display: 'flex',
                width: '100%',
                marginTop: 30,
                direction: this.shouldDisplayRtl() ? 'rtl' : 'ltr'
            }}>
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

    return {
        resonator,
        answered,
        question,
        currentQuestionIdx,
        questionsCount: resonator.questions.length
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        sendAnswer: actions.sendAnswer
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResonatorFeedback);
