import React from "react";
import { Stepper, Step, StepLabel, StepContent, RadioGroup, Radio, FormControlLabel } from "@material-ui/core";

import { getOptionLabel } from "./utils";

export default ({ resonator, activeQuestion, answerQuestion }) => (
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
                </StepContent>
            </Step>
        ))}
    </Stepper>
);
