import React, { useRef } from "react";
import {TextField, Button, makeStyles} from "@material-ui/core";
import QuestionTypography from "components/followers/questionnaire/questions/QuestionTypography";

const useStyles = makeStyles((theme) => ({
    options: {
        marginTop: theme.spacing(2),
        display: "flex",
        alignItems: "center"
    },
    option: {
        "&:not(:last-child)": {
            marginBottom: theme.spacing(2),
            marginRight: theme.spacing(2)
        },
    },
    or: {
        margin: "0px 5px"
    }
}));

export default function TextQuestion({ question, answerBody, handleAnswer }) {
    const classes = useStyles();
    const textInput = useRef(answerBody);

    return (
        <div>
            <QuestionTypography>{question}</QuestionTypography>
            <div className={classes.options}>
                <TextField label="Text" className={classes.option} inputProps={{ maxLength: 250 }} defaultValue={answerBody} inputRef={textInput} />
                <Button color="primary" variant="contained" onClick={() => handleAnswer(textInput.current.value)}>Answer</Button>
                <div className={classes.or}>OR</div>
                <Button color="primary" variant="contained" onClick={() => handleAnswer(" ")}>Skip</Button>
            </div>
        </div>
    );
}
