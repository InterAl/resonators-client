import React from "react";
import NextButton from "./nextButton";
import BackButton from "./backButton";
import "./navButtons.scss";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme =>({
    navButton: {
        marginRight: theme.spacing(1)
    }
}))

export default ({ onNext, onBack, noBack, noNext }) => {
    const classes = useStyles();

    return (
        <div className="navButtons">
            {!noBack && <BackButton onClick={onBack} className={classes.navButton} />}
            {!noNext && <NextButton onClick={onNext} className={classes.navButton} />}
        </div>
    );
};
