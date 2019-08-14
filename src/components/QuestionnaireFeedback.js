import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/questionnaireFeedbackActions';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import RaisedButton from 'material-ui/RaisedButton';
import { GridList, GridTile } from 'material-ui/GridList'

import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import styles from './QuestionnaireFeedback.cssmodule.scss';
import React, { Component } from 'react';
import classNames from 'classnames';

class QuestionnaireFeedback extends Component {
    constructor(props) {
        super(props);

        this.renderQuestion = this.renderQuestion.bind(this);
    }
    handleAnswerClick(answerId) {
        this.props.sendQuestionnaireAnswer({
            answerId
        });
    }

    renderQuestionDescription(description) {
        return (
            <div>
                {description}
            </div>
        );
    }

    renderBackButton() {
        const { currentQuestionIdx } = this.props;
        return (
            <GridTile>
                <FlatButton
                    disabled={(currentQuestionIdx <= 0)}
                    style={{ marginTop: 4 }}
                    label={this.props.rtl ? 'חזור' : '< Back'}
                    onClick={this.props.showPreviousQuestion}
                />
            </GridTile>
        );
    }
    renderNextButton() {
        const { currentQuestionIdx, questionsCount } = this.props;
        return (
            <GridTile>
                <FlatButton
                    disabled={(currentQuestionIdx >= questionsCount)}
                    style={{ marginTop: 4, textAlign: "right" }}
                    label={this.props.rtl ? 'חזור' : 'Next >'}
                    onClick={this.props.showNextQuestion}
                />
            </GridTile>
        );
    }

    renderAnswer(answer, answerType) {
        const { options } = this.props;
        return (
            <div>
                <RadioButtonGroup
                    valueSelected={answer}
                    onChange={(event, value) => this.handleAnswerClick(value)}
                >
                    {_.map(options, op => (
                        <RadioButton value={op[2]} label={op[1]} valueSelected={answer == op[2]} />
                    ))}
                </RadioButtonGroup>
            </div>);
    }

    renderQuestion(q) {
        const { rtl } = this.props;
        const { header } = this.props;

        const q1 = q[1];
        const ans = q[2];
        const ansType = q[5];
        const { currentQuestionIdx, questionsCount } = this.props;

        return (
            <Card key={q[0][0]}>
                <CardHeader
                    className={
                        classNames(styles.questionHeader, {
                            [styles.questionDescriptionRtl]: rtl,
                            [styles.questionDescriptionLtr]: !rtl
                        })
                    }
                    title={this.renderQuestionDescription(header[0][0])}
                />
                <Divider style={{ marginTop: 1, marginBottom: 1, height: 2, backgroundColor: '#05c514' }} />

                <CardText className={
                    classNames(styles.questionText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    {<div className='listitem-text'>{header[1][0]}</div>}
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 1, height: 2, backgroundColor: '#770077' }} />

                <CardText className={
                    classNames(styles.questionText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    <div>
                        {`Question ${currentQuestionIdx + 1} of ${questionsCount + 1}`}
                    </div>
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 1, height: 2, backgroundColor: '#770077' }} />

                <CardText className={
                    classNames(styles.questionText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    <div>
                        {`${q1}`}
                    </div>
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 1, height: 2, backgroundColor: '#05c514' }} />

                <CardText className={
                    classNames(styles.questionText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    {this.renderAnswer(ans, ansType)}
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 1, height: 2, backgroundColor: '#05c514' }} />


                <CardText className={
                    classNames(styles.questionText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    <GridList
                        cellHeight="auto"
                        direction="row"
                    >
                        {this.renderBackButton()}
                        {this.renderNextButton()}
                    </GridList>
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 1, height: 2, backgroundColor: '#05c514' }} />

            </Card >
        );
    }

    renderDone() {
        return (
            <Card key='done'>
                <CardText className={styles.done}>
                    Your feedback was successfully recorded.
                    <br />
                    {this.renderBackButton()}
                </CardText>
            </Card>
        );
    }

    render() {
        const { question } = this.props;

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
    const { resonator, questionnaire, currentQuestionIdx } = state.questionnaireFeedback;
    if (resonator) {
        const header = questionnaire.header;
        const question = questionnaire.row_values[currentQuestionIdx];
        const options = questionnaire.options;

        return {
            resonator,
            header,
            question,
            currentQuestionIdx,
            options: options,
            questionsCount: questionnaire.row_values.length - 1,
            rtl: question && shouldDisplayRtl(question)
        };
    }
    else {
        return {};
    }
}

function shouldDisplayRtl(question) {
    function isHebrewLetter(letter) {
        const code = letter.charCodeAt(0);
        return code === 32 || code >= 1488 && code <= 1514;
    }

    const text = question[1] || '';
    const textArr = text.split('');

    const hebrewLettersCount = _.reduce(textArr, (acc, letter) => {
        return acc + (isHebrewLetter(letter) ? 1 : 0);
    }, 0);

    const isHebrew = hebrewLettersCount / textArr.length > 0.5;
    return isHebrew;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        sendQuestionnaireAnswer: actions.sendAnswer,
        showPreviousQuestion: actions.showPreviousQuestion,
        showNextQuestion: actions.showNextQuestion
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionnaireFeedback);
