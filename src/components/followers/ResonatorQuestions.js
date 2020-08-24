import React, { useState, useEffect } from "react";
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
} from "@material-ui/core";

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

export default ({ resonator, answerQuestion }) => {
    const classes = useStyle();

    const [activeQuestion, setActiveQuestion] = useState(0);

    useEffect(() => setActiveQuestion(findFirstUnansweredQuestion(resonator)), []);

    const stepBack = () => setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);
    const stepNext = () =>
        setActiveQuestion((prevActiveQuestion) => Math.min(prevActiveQuestion + 1, resonator.questions.length - 1));

    const handleAnswer = (resonatorQuestion) => (event) =>
        answerQuestion(resonator, resonatorQuestion, event.target.value).then(
            () => !resonatorQuestion.answer && stepNext()
        );

    return (
        <>
            <Stepper orientation="vertical" activeStep={activeQuestion}>
                {resonator.questions.map((question, index) => (
                    <Step key={question.id} completed={Boolean(question.answer)}>
                        <StepLabel>
                            {index === activeQuestion || question.answer ? question.body : `Question ${index + 1}`}
                        </StepLabel>
                        <StepContent>
                            <RadioGroup value={question.answer} onChange={handleAnswer(question)}>
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
