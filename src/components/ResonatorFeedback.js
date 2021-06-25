import _ from "lodash";
import { connect } from "react-redux";
import React, { Component } from "react";
import { withRouter } from "react-router";
import { bindActionCreators } from "redux";
import { Button, Card, CardHeader, CardContent, CardActions, withTheme, Typography, TextareaAutosize } from "@material-ui/core";

import { actions } from "../actions/feedbackActions";
import Layout from "./layouts/EmptyCenteredLayout";

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
            type: query.type
        });
        this.textInputRef = React.createRef();
    }

    handleAnswerClick(questionId, answerId, type) {
        this.props.sendAnswer({
            questionId,
            answerId,
            type
        });
    }

    renderAnswer(q, a, idx) {
        let label;

        if (q.question_kind === "numeric") {
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
                key={idx}
                onClick={() => this.handleAnswerClick(q.id, a.id, q.question_kind)}
                style={{ marginBottom: 20, textAlign: this.props.rtl ? "right" : "left", display: "block" }}
                variant={this.props.answered[q.id] === a.id ? "contained" : "outlined"}
                color="primary"
            >
                {label}
            </Button>
        );
    }

    renderQuestionDescription() {
        const total = this.props.questionsCount;
        const current = this.props.currentQuestionIdx + 1;
        return `(${current} / ${total})`;
    }

    renderBackButton() {
        return <Button onClick={this.props.showPreviousQuestion}>{this.props.rtl ? "חזור" : "Back"}</Button>;
    }

    renderQuestion(q) {
        const { question } = q;
        const answers = _.orderBy(question.answers, (a) => a.rank);
        const { rtl } = this.props;
        let input;
        if (question.question_kind === 'text') {
            input = <CardContent>
                <TextareaAutosize ref={this.textInputRef} rowsMin={3} style={{ width: "100%", resize: "vertical" }} placeholder="Text..."/>
                <Button
                    key={question.id}
                    onClick={() => this.handleAnswerClick(this.props.resonator.questions.find(q => q.question_id === question.id)?.id || question.id, (this.textInputRef.current.value) ? this.textInputRef.current.value : "", question.question_kind)}
                    style={{ marginTop: 20, textAlign: this.props.rtl ? "right" : "left", display: "block" }}
                    variant={this.props.answered[question.id] ? "contained" : "outlined"}
                    color="primary"
                >Save</Button>
            </CardContent>
        } else {
            input = <CardContent>{_.map(answers, (a) => this.renderAnswer(question, a))}</CardContent>
        }

        return (
            <Card key={q.id} elevation={10}>
                <CardHeader
                    title={question.description}
                    subheader={this.renderQuestionDescription()}
                    style={{ textAlign: rtl ? "right" : "left" }}
                />
                {input}

                {this.props.currentQuestionIdx > 1 && <CardActions>{this.renderBackButton()}</CardActions>}
            </Card>
        );
    }

    renderDone() {
        return (
            <Card key="done" elevation={10}>
                <CardHeader
                    title={
                        <Typography variant="h6" style={{ color: this.props.theme.palette.success.main }}>
                            Your feedback was successfully recorded
                        </Typography>
                    }
                />
                {this.props.currentQuestionIdx > 1 && <CardActions>{this.renderBackButton()}</CardActions>}
            </Card>
        );
    }

    render() {
        const { question } = this.props;
        return <Layout colorful>{question ? this.renderQuestion(question) : this.renderDone()}</Layout>;
    }
}

function mapStateToProps(state) {
    const { resonator, answered, currentQuestionIdx } = state.resonatorFeedback;

    const question = ((resonator?.questions || [])[currentQuestionIdx - 1]?.question.question_kind === 'text')
                        ? (resonator?.questions || [])[currentQuestionIdx - 1]
                        : (resonator?.questions || [])[currentQuestionIdx];

    return {
        resonator,
        answered,
        question,
        currentQuestionIdx,
        questionsCount: (resonator?.questions || []).length,
        rtl: question && shouldDisplayRtl(question?.question),
    };
}

function shouldDisplayRtl(question) {
    function isHebrewLetter(letter) {
        const code = letter.charCodeAt(0);
        return code === 32 || (code >= 1488 && code <= 1514);
    }

    const text = question.title || "";
    const textArr = text.split("");

    const hebrewLettersCount = _.reduce(
        textArr,
        (acc, letter) => {
            return acc + (isHebrewLetter(letter) ? 1 : 0);
        },
        0
    );

    const isHebrew = hebrewLettersCount / textArr.length > 0.5;
    return isHebrew;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            sendAnswer: actions.sendAnswer,
            loadResonator: actions.loadResonator,
            showPreviousQuestion: actions.showPreviousQuestion,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withTheme(withRouter(ResonatorFeedback)));
