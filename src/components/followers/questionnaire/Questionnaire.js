import React, { useState, useEffect } from "react";
import { Stepper, Step, StepLabel, StepContent, makeStyles, Divider, Button } from "@material-ui/core";

import Question from "./questions";
import Direction from "../../Direction";
import ResonatorAnswers from "./ResonatorAnswers";
import NavigationControls from "./NavigationControls";
import { useStateWithHistory } from "../../hooks";

const useStyle = makeStyles((theme) => ({
    controls: {
        marginTop: theme.spacing(2),
        display: "inline-block",
    },
    done: {
        margin: theme.spacing(0, 1),
    },
}));

const findFirstUnansweredQuestion = (questions) =>
    Math.max(
        questions.findIndex((question) => !isQuestionAnswered(question)),
        0
    );

const isQuestionAnswered = (question) => Boolean(question.answer);

export default ({ questions, onAnswer }) => {
    const classes = useStyle();

    const completed = questions.every(isQuestionAnswered);

    const [editMode, setEditMode] = useState(!completed);
    const [activeQuestion, setActiveQuestion, activeQuestionHistory] = useStateWithHistory(0);

    useEffect(() => setActiveQuestion(findFirstUnansweredQuestion(questions)), []);

    function completeQuestionnaire() {
        setEditMode(false);
    }

    function autoNext(index) {
        if (index === questions.length - 1) {
            completeQuestionnaire();
        } else {
            setActiveQuestion(activeQuestion + 1);
        }
    }

    function handleAnswer(question, index) {
        return (answerId) =>
            onAnswer(question.id, answerId).then(() => !isQuestionAnswered(question) && autoNext(index));
    }

    return (
        <div>
            {editMode ? (
                <Stepper orientation="vertical">
                    {questions.map((question, index) => {
                        const active = index === activeQuestion;
                        const answered = isQuestionAnswered(question);
                        const seen = activeQuestionHistory.includes(index);
                        const label = (seen || answered) && !active ? question.body : <Divider />;

                        return (
                            <Step key={question.id} active={active} completed={answered}>
                                <Direction by={question.body}>
                                    <StepLabel>{label}</StepLabel>
                                    <StepContent>
                                        <Question question={question} onAnswer={handleAnswer(question, index)} />
                                        <NavigationControls
                                            index={activeQuestion}
                                            total={questions.length}
                                            setIndex={setActiveQuestion}
                                            className={classes.controls}
                                            nextDisabled={!answered}
                                        />
                                        {completed ? (
                                            <Button
                                                color="primary"
                                                variant="contained"
                                                onClick={completeQuestionnaire}
                                                className={classes.done}
                                            >
                                                Done
                                            </Button>
                                        ) : null}
                                    </StepContent>
                                </Direction>
                            </Step>
                        );
                    })}
                </Stepper>
            ) : (
                <>
                    <ResonatorAnswers questions={questions} />
                    <Button color="primary" onClick={() => setEditMode(true)}>
                        Edit answers
                    </Button>
                </>
            )}
        </div>
    );
};
