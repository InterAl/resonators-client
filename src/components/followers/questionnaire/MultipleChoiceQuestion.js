import React from "react";
import { makeStyles } from "@material-ui/core";

import QuestionTypography from "./QuestionTypography";
import MultipleChoiceOption from "./MultipleChoiceOption";

function getOptionLabel(option) {
    return option.label ? `${option.value} - ${option.label}` : option.value;
}

const useStyles = makeStyles((theme) => ({
    options: {
        marginTop: theme.spacing(2),
    },
    option: {
        marginBottom: theme.spacing(2),
    },
}));

export default function MultipleChoiceQuestion({ question, options, chosen, handleAnswer }) {
    const classes = useStyles();

    return (
        <div>
            <QuestionTypography>{question}</QuestionTypography>
            <div className={classes.options}>
                {options.map((option) => (
                    <MultipleChoiceOption
                        key={option.id}
                        className={classes.option}
                        chosen={chosen === option.id}
                        label={getOptionLabel(option)}
                        onClick={() => handleAnswer(option.id)}
                    />
                ))}
            </div>
        </div>
    );
}
