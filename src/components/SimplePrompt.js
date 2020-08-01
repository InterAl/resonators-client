import React from "react";
import PropTypes from "prop-types";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    dialogContent: {
        fontFamily: theme.typography.fontFamily
    }
}))

export default function SimplePrompt(props) {
    const classes = useStyles()

    return (
        <Dialog open={props.open} onClose={props.onClose} className={props.className}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                {props.text.constructor === String ? (
                    <DialogContentText>{props.text}</DialogContentText>
                ) : (
                    /* in case a component is passed */
                    <div className={classes.dialogContent}>
                        {props.text}
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>
                    Cancel
                </Button>
                <Button
                    onClick={() => props.onClose(props.onAccept)}
                    color="primary"
                    variant="contained"
                    className="confirmBtn"
                >
                    {props.acceptText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

SimplePrompt.propTypes = {
    onAccept: PropTypes.func.isRequired,
    acceptText: PropTypes.string.isRequired,
    className: PropTypes.string,
};
