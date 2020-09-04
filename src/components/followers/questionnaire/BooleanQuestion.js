import React from "react";
import { makeStyles } from "@material-ui/core";

import Option from "./MultipleChoiceOption";
import QuestionTypography from "./QuestionTypography";

const useStyles = makeStyles((theme) => ({
    options: {
        display: "flex",
        marginTop: theme.spacing(2),
    },
    no: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
    },
    yes: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
    },
}));

export default function BooleanQuestion({ question, yes, no, chosen, handleAnswer }) {
    const classes = useStyles();

    return (
        <div>
            <QuestionTypography>{question}</QuestionTypography>
            <div className={classes.options}>
                <Option
                    label={yes.label}
                    chosen={chosen === yes.id}
                    onClick={() => handleAnswer(yes.id)}
                    className={classes.yes}
                />
                <Option
                    label={no.label}
                    chosen={chosen === no.id}
                    onClick={() => handleAnswer(no.id)}
                    className={classes.no}
                />
            </div>
        </div>
    );
}
