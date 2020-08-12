import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
    Stepper,
    Step,
    StepLabel,
    StepContent,
    RadioGroup,
    Radio,
    FormControlLabel,
    Button,
    makeStyles,
    Grow,
} from "@material-ui/core";

import fetcher from "../../api/fetcher";
import { getOptionLabel } from "./utils";

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

    const [activeQuestion, setActiveQuestion] = useState(0);

    useEffect(() => setActiveQuestion(findFirstUnansweredQuestion(resonator)), []);

    const stepBack = () => setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);
    const stepNext = () => setActiveQuestion((prevActiveQuestion) => prevActiveQuestion + 1);

    const answerQuestion = (resonatorQuestion) => (event) => {
        fetcher
            .put(`/follower/resonators/${resonator.id}`, {
                resonatorQuestionId: resonatorQuestion.id,
                answerId: event.target.value,
            })
            .then((data) => data.resonator)
            .then(setResonator)
            .then(confirmSave)
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
            <Stepper orientation="vertical" activeStep={activeQuestion}>
                {resonator.questions.map((question, index) => (
                    <Step key={question.id} completed={Boolean(question.answer)}>
                        <StepLabel>
                            {index === activeQuestion || question.answer ? question.body : `Question ${index + 1}`}
                        </StepLabel>
                        <StepContent>
                            <RadioGroup value={question.answer} onChange={answerQuestion(question)}>
                                {question.options.map((option) => (
                                    <FormControlLabel
                                        key={option.id}
                                        value={option.id}
                                        control={<Radio color="primary" />}
                                        label={getOptionLabel(option, question)}
                                    />
                                ))}
                            </RadioGroup>
                            <div className={classes.controls}>
                                <Button onClick={stepBack} disabled={index === 0}>
                                    Back
                                </Button>
                                <Button
                                    color="primary"
                                    onClick={stepNext}
                                    disabled={index === resonator.questions.length - 1 || !question.answer}
                                >
                                    Next
                                </Button>
                            </div>
                        </StepContent>
                    </Step>
                ))}
            </Stepper>
        </>
    );
};
