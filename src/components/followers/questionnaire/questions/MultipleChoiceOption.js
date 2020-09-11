import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { RadioButtonChecked, RadioButtonUnchecked } from "@material-ui/icons";

const useStyles = makeStyles(() => ({
    root: {
        textTransform: "none",
        justifyContent: "start",
        textAlign: "start",
    },
}));

export default function MultipleChoiceOption({ label, onClick, chosen, ...extra }) {
    const classes = useStyles();

    return (
        <Button
            startIcon={chosen ? <RadioButtonChecked /> : <RadioButtonUnchecked />}
            color={chosen ? "primary" : "default"}
            classes={{ root: classes.root }}
            variant="outlined"
            onClick={onClick}
            fullWidth
            {...extra}
        >
            {label}
        </Button>
    );
}
