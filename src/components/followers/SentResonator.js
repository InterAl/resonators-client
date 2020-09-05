import { useSnackbar } from "notistack";
import { useHistory } from "react-router";
import React, { useEffect, useState } from "react";
import { Link as LinkIcon } from "@material-ui/icons";
import {
    makeStyles,
    Card,
    CardMedia,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Typography,
    Grow,
    Button,
} from "@material-ui/core";

import Direction from "../Direction";
import fetcher from "../../api/fetcher";
import LoadingOverlay from "./LoadingOverlay";
import ResonatorQuestionnaire from "./questionnaire/Questionnaire";
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

export default function SentResonator({ sentResonatorId }) {
    const classes = useStyles();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [resonator, setResonator] = useState(null);

    const showError = (response) =>
        response.json().then(({ status }) =>
            enqueueSnackbar(status, {
                variant: "error",
                persist: true,
                TransitionComponent: Grow,
                anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "center",
                },
            })
        );

    const answerQuestion = (resonatorQuestionId, answerId) => {
        return fetcher
            .put(`/follower/resonators/${resonator.id}`, {
                resonatorQuestionId,
                answerId,
            })
            .then((data) => data.resonator)
            .then(setResonator)
            .then(confirmSave)
            .catch(showError);
    };

    const confirmSave = () =>
        enqueueSnackbar("Answer saved", {
            autoHideDuration: 2000,
            TransitionComponent: Grow,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
            },
        });

    const goToAllResonators = () => history.push("/follower/resonators");

    useEffect(() => {
        setLoading(true);
        fetcher(`/follower/resonators/${sentResonatorId}`)
            .then((data) => data.resonator)
            .then(setResonator)
            .catch(showError)
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <LoadingOverlay loading={loading} />
            {!loading && resonator ? (
                <Grow in>
                    <Card>
                        <Direction by={resonator.title}>
                            <CardHeader
                                title={resonator.title}
                                subheader={formatResonatorTime(resonator.time)}
                                titleTypographyProps={{ gutterBottom: true }}
                            />
                        </Direction>
                        <Divider />
                        {resonator.picture ? (
                            <>
                                <CardMedia image={resonator.picture} className={classes.media} />
                                <Divider />
                            </>
                        ) : null}
                        <CardContent>
                            <ResonatorBody resonator={resonator} />
                        </CardContent>
                        {resonator.questions.length ? (
                            <>
                                <Divider />
                                <CardContent>
                                    <ResonatorQuestionnaire questions={resonator.questions} onAnswer={answerQuestion} />
                                </CardContent>
                            </>
                        ) : null}
                        <Divider />
                        <CardActions>
                            <Button onClick={goToAllResonators}>Close</Button>
                        </CardActions>
                    </Card>
                </Grow>
            ) : null}
        </>
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
