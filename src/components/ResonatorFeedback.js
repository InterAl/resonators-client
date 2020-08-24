import _ from 'lodash';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {actions} from '../actions/feedbackActions';
import { Button, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import styles from './ResonatorFeedback.cssmodule.scss';
import React, {Component} from 'react';
import classNames from 'classnames';

class ResonatorFeedback extends Component {
    constructor(props) {
        super(props);

        this.renderQuestion = this.renderQuestion.bind(this);
        this.renderAnswer = this.renderAnswer.bind(this);
        this.handleAnswerClick = this.handleAnswerClick.bind(this);

        const query = Object.fromEntries(new URLSearchParams(this.props.location.search));
        this.props.loadResonator({
            resonatorId: this.props.match.params.resonatorId,
            questionId: query.question_id,
            answerId: query.answer_id,
            sentResonatorId: query.sent_resonator_id,
        })
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
            <Button
                className={classNames(styles.answerButton, {
                    [styles.selectedAnswer]: this.props.answered[q.id] === a.id
                })}
                key={idx}
                onClick={() => this.handleAnswerClick(q.id, a.id)}
                style={{ marginBottom: 30, textAlign: this.props.rtl ? 'right' : 'left' }}
                color="primary">
                {label}
            </Button>
        );
    }

    renderQuestionDescription(description) {
        const total = this.props.questionsCount;
        const current = this.props.currentQuestionIdx + 1;

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
        return this.props.currentQuestionIdx > 1 && (
            <Button
                style={{marginTop: 24}}
                onClick={this.props.showPreviousQuestion}>
                {this.props.rtl ? 'חזור' : 'Back'}
            </Button>
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
                <CardContent>
                    {_.map(answers, a => this.renderAnswer(question, a))}
                </CardContent>
                <CardActions>
                    {this.renderBackButton()}
                </CardActions>
            </Card>
        );
    }

    renderDone() {
        return (
            <Card key='done'>
                <CardContent className={styles.done}>
                    Your feedback was successfully recorded.
                </CardContent>
                <CardActions>
                    {this.renderBackButton()}
                </CardActions>
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
    const question = (resonator?.questions || [])[currentQuestionIdx];

    return {
        resonator,
        answered,
        question,
        currentQuestionIdx,
        questionsCount: (resonator?.questions || []).length,
        rtl: question && shouldDisplayRtl(question?.question)
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
        loadResonator: actions.loadResonator,
        showPreviousQuestion: actions.showPreviousQuestion
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ResonatorFeedback));
