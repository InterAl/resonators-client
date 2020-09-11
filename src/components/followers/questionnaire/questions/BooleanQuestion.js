import React from "react";
import { makeStyles } from "@material-ui/core";

import Option from "./MultipleChoiceOption";
import QuestionTypography from "./QuestionTypography";

const useStyles = makeStyles((theme) => ({
    options: {
        marginTop: theme.spacing(2),
        [theme.breakpoints.up("sm")]: {
            display: "flex",
        },
    },
    no: {
        [theme.breakpoints.up("sm")]: {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
        },
    },
    yes: {
        [theme.breakpoints.up("sm")]: {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
        },
        [theme.breakpoints.down("xs")]: {
            marginBottom: theme.spacing(2),
        },
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
