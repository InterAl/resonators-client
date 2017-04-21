import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actions} from '../actions/feedbackActions';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
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
            <RaisedButton
                className={classNames(styles.answerButton, {
                    [styles.selectedAnswer]: this.props.answered[q.id] === a.id
                })}
                buttonStyle={{textAlign: this.props.rtl ? 'right' : 'left'}}
                key={idx}
                label={label}
                onClick={() => this.handleAnswerClick(q.id, a.id)}
                style={{ marginBottom: 30 }}
                primary
            />
        );
    }

    renderQuestionDescription(description) {
        const total = this.props.questionsCount;
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

    renderBackButton() {
        const total = this.props.questionsCount - 1;
        const current = total - this.props.currentQuestionIdx;

        return current > 1 && (
            <FlatButton
                style={{marginTop: 24}}
                label={this.props.rtl ? 'חזור' : 'Back'}
                onClick={this.props.showPreviousQuestion}
            />
        );
    }

    renderQuestion(q) {
        const {question} = q;
        const answers = _.orderBy(question.answers, a => a.rank);
        const {rtl} = this.props;

        return (
            <Card key={q.id}>
                <CardHeader
                    className={
                        classNames(styles.questionDescription, {
                            [styles.questionDescriptionRtl]: rtl,
                            [styles.questionDescriptionLtr]: !rtl
                        })
                    }
                    title={this.renderQuestionDescription(question.description)}
                />
                <CardText>
                    {_.map(answers, a => this.renderAnswer(question, a))}
                    {this.renderBackButton()}
                </CardText>
            </Card>
        );
    }

    renderDone() {
        return (
            <Card key='done'>
                <CardText className={styles.done}>
                    Your feedback was successfully recorded.
                    <br/>
                    {this.renderBackButton()}
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
                direction: this.props.rtl ? 'rtl' : 'ltr'
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
        questionsCount: resonator.questions.length,
        rtl: question && shouldDisplayRtl(question.question)
    };
}

function shouldDisplayRtl(question) {
    function isHebrewLetter(letter) {
        const code = letter.charCodeAt(0);
        return code === 32 || code >= 1488 && code <= 1514;
    }

    const text = question.title || '';
    const textArr = text.split('');

    const hebrewLettersCount = _.reduce(textArr, (acc, letter) => {
        return acc + (isHebrewLetter(letter) ? 1 : 0);
    }, 0);

    const isHebrew = hebrewLettersCount / textArr.length > 0.5;
    return isHebrew;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        sendAnswer: actions.sendAnswer,
        showPreviousQuestion: actions.showPreviousQuestion
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResonatorFeedback);
