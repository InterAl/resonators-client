import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import { Stepper, Step, StepLabel, StepContent, makeStyles, Grow, Divider } from "@material-ui/core";

import { useSeen } from "../../hooks";
import fetcher from "../../../api/fetcher";
import BooleanQuestion from "./BooleanQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";
import NavigationControls from "./NavigationControls";

const useStyle = makeStyles((theme) => ({
    controls: {
        marginTop: theme.spacing(2),
    },
}));

const findFirstUnansweredQuestion = (resonator) =>
    Math.max(
        0,
        resonator.questions.findIndex((question) => !question.answer)
    );

function renderQuestion(question, handler) {
    switch (question.type) {
        case "numeric":
            return (
                <MultipleChoiceQuestion
                    question={question.body}
                    options={question.options}
                    chosen={question.answer}
                    handleAnswer={handler}
                />
            );
        case "boolean":
            return (
                <BooleanQuestion
                    question={question.body}
                    yes={question.options[0]}
                    no={question.options[1]}
                    chosen={question.answer}
                    handleAnswer={handler}
                />
            );
        default:
            return null;
    }
}

function Section({ active, question, children, ...extra }) {
    const seen = useSeen(active);

    const completed = Boolean(question.answer);
    const label = (seen || completed) && !active ? question.body : <Divider />;

    return (
        <Step active={active} {...extra}>
            <StepLabel completed={completed}>{label}</StepLabel>
            <StepContent>{children}</StepContent>
        </Step>
    );
}

export default ({ resonator, setResonator, showError }) => {
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();

    const [activeQuestion, setActiveQuestion] = useState(0);

    useEffect(() => setActiveQuestion(findFirstUnansweredQuestion(resonator)), []);

    const stepNext = () =>
        setActiveQuestion((prevActiveQuestion) => Math.min(prevActiveQuestion + 1, resonator.questions.length - 1));

    const answerQuestion = (resonatorQuestion) => (answerId) => {
        fetcher
            .put(`/follower/resonators/${resonator.id}`, {
                resonatorQuestionId: resonatorQuestion.id,
                answerId,
            })
            .then((data) => data.resonator)
            .then(setResonator)
            .then(confirmSave)
            .then(() => !resonatorQuestion.answer && stepNext())
            .catch(showError);
    };

    const confirmSave = () =>
        enqueueSnackbar("Answer saved", {
            autoHideDuration: 2000,
            TransitionComponent: Grow,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
            },
        });

    return (
        <>
            <Stepper orientation="vertical">
                {resonator.questions.map((question, index) => (
                    <Section key={question.id} active={index === activeQuestion} question={question}>
                        {renderQuestion(question, answerQuestion(question))}
                        <NavigationControls
                            index={activeQuestion}
                            setIndex={setActiveQuestion}
                            total={resonator.questions.length}
                            nextDisabled={!question.answer}
                            className={classes.controls}
                        />
                    </Section>
                ))}
            </Stepper>
        </>
    );
};
