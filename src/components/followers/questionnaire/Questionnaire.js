import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Stepper, Step, StepLabel, StepContent, makeStyles, Grow, Divider } from "@material-ui/core";

import Question from "./questions";
import fetcher from "../../../api/fetcher";
import { useStateWithHistory } from "../../hooks";
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

export default ({ resonator, setResonator, showError }) => {
    const classes = useStyle();
    const { enqueueSnackbar } = useSnackbar();

    const [activeQuestion, setActiveQuestion, activeQuestionHistory] = useStateWithHistory(0);

    useEffect(() => setActiveQuestion(findFirstUnansweredQuestion(resonator)), []);

    const stepNext = () => setActiveQuestion(Math.min(activeQuestion + 1, resonator.questions.length - 1));

    const answerQuestion = (resonatorQuestion, answerId) => {
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
                {resonator.questions.map((question, index) => {
                    const active = index === activeQuestion;
                    const completed = Boolean(question.answer);
                    const seen = activeQuestionHistory.includes(index);
                    const label = (seen || completed) && !active ? question.body : <Divider />;

                    return (
                        <Step key={question.id} active={active} completed={completed}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                <Question question={question} onAnswer={answerQuestion} />
                                <NavigationControls
                                    index={activeQuestion}
                                    setIndex={setActiveQuestion}
                                    total={resonator.questions.length}
                                    className={classes.controls}
                                    nextDisabled={!completed}
                                />
                            </StepContent>
                        </Step>
                    );
                })}
            </Stepper>
        </>
    );
};
