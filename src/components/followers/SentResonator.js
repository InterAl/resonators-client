import React, { useState } from "react";
import { Link as LinkIcon, Close } from "@material-ui/icons";
import {
    makeStyles,
    Card,
    CardMedia,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Typography,
    Button,
    IconButton,
} from "@material-ui/core";

import Direction from "../Direction";
import ResonatorAnswers from "./ResonatorAnswers";
import ResonatorQuestions from "./ResonatorQuestions";
import { formatResonatorTime } from "./utils";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
    },
    media: {
        height: 200,
        margin: theme.spacing(2, 0),
        backgroundSize: "contain",
    },
    link: {
        textTransform: "none",
        maxWidth: "100%",
    },
    linkLabel: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
    },
    backButton: {
        position: "absolute",
        right: 0,
        transform: "translate(50%, -50%)",
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[1],
    },
}));

export default function SentResonator({ resonator, answerQuestion, close = null }) {
    const classes = useStyles();

    const [editMode, setEditMode] = useState(!resonator.done);

    return (
        <div className={classes.root}>
            {close && (
                <IconButton className={classes.backButton} size="small" onClick={close}>
                    <Close />
                </IconButton>
            )}
            <Card>
                <Direction by={resonator.title}>
                    <CardHeader
                        title={resonator.title}
                        subheader={formatResonatorTime(resonator.time)}
                        titleTypographyProps={{ gutterBottom: true }}
                    />
                </Direction>
                <Divider />
                <CardMedia image={resonator.picture} className={classes.media} />
                <Divider />
                <CardContent>
                    <ResonatorBody resonator={resonator} />
                </CardContent>
                {resonator.questions.length ? (
                    <>
                        <Divider />
                        <CardContent>
                            {editMode ? (
                                <ResonatorQuestions resonator={resonator} answerQuestion={answerQuestion} />
                            ) : (
                                <ResonatorAnswers resonator={resonator} />
                            )}
                        </CardContent>
                        <Divider />
                        <CardActions>
                            {editMode ? (
                                <Button
                                    color="primary"
                                    variant="contained"
                                    disabled={!resonator.done}
                                    onClick={() => setEditMode(false)}
                                >
                                    Finish
                                </Button>
                            ) : (
                                <Button color="primary" onClick={() => setEditMode(true)}>
                                    Edit answers
                                </Button>
                            )}
                        </CardActions>
                    </>
                ) : null}
            </Card>
        </div>
    );
}

const ResonatorBody = ({ resonator }) => {
    const classes = useStyles();

    return (
        <>
            <Direction by={resonator.content}>
                <Typography paragraph>{resonator.content}</Typography>
            </Direction>
            {resonator.link ? (
                <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    className={classes.link}
                    href={resonator.link}
                    rel="noreferrer"
                    target="_blank"
                >
                    <span className={classes.linkLabel}>{resonator.link}</span>
                </Button>
            ) : null}
        </>
    );
};
