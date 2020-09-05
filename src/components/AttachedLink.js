import React from "react";
import { Link } from "@material-ui/icons";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    link: {
        textTransform: "none",
        maxWidth: "100%",
    },
    linkLabel: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
});

export default function AttachedLink({ link }) {
    const classes = useStyles();

    return (
        <Button
            href={link}
            size="small"
            color="primary"
            variant="outlined"
            startIcon={<Link />}
            className={classes.link}
            rel="noreferrer"
            target="_blank"
        >
            <span className={classes.linkLabel}>{link}</span>
        </Button>
    );
}
