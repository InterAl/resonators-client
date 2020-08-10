import { useSnackbar } from "notistack";
import { useParams } from "react-router";
import React, { useEffect, useState } from "react";
import {
    makeStyles,
    Card,
    CardMedia,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Link,
    Typography,
    Grow,
} from "@material-ui/core";

import Direction from "../Direction";
import fetcher from "../../api/fetcher";
import LoadingOverlay from "./LoadingOverlay";
import ResonatorAnswers from "./ResonatorAnswers";
import ResonatorControls from "./ResonatorControls";
import ResonatorQuestions from "./ResonatorQuestions";
import { formatResonatorTime, findFirstUnansweredQuestion } from "./utils";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 200,
        margin: theme.spacing(2, 0),
        backgroundSize: "contain",
    },
}));

export default function SentResonator() {
    const classes = useStyles();
    const { sentResonatorId } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [resonator, setResonator] = useState(null);
    const [activeQuestion, setActiveQuestion] = useState(0);

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

    const confirmSave = () =>
        enqueueSnackbar("Answer saved", {
            autoHideDuration: 2000,
            TransitionComponent: Grow,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
            },
        });

    useEffect(() => {
        setLoading(true);
        fetcher(`/follower/resonators/${sentResonatorId}`)
            .then((data) => data.resonator)
            .then((resonator) => {
                setResonator(resonator);
                setEditMode(!resonator.done);
                setActiveQuestion(findFirstUnansweredQuestion(resonator));
            })
            .catch(showError)
            .finally(() => setLoading(false));
    }, []);

    const answerQuestion = (resonatorQuestion) => (event) => {
        fetcher
            .put(`/follower/resonators/${sentResonatorId}`, {
                resonatorQuestionId: resonatorQuestion.id,
                answerId: event.target.value,
            })
            .then((data) => data.resonator)
            .then(setResonator)
            .then(confirmSave)
            .catch(showError);
    };

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
                                        <ResonatorQuestions
                                            resonator={resonator}
                                            activeQuestion={activeQuestion}
                                            answerQuestion={answerQuestion}
                                        />
                                    ) : (
                                        <ResonatorAnswers resonator={resonator} />
                                    )}
                                </CardContent>
                                <Divider />
                                <CardActions>
                                    <ResonatorControls
                                        resonator={resonator}
                                        editMode={editMode}
                                        setEditMode={setEditMode}
                                        activeQuestion={activeQuestion}
                                        setActiveQuestion={setActiveQuestion}
                                    />
                                </CardActions>
                            </>
                        ) : null}
                    </Card>
                </Grow>
            ) : null}
        </>
    );
}

const ResonatorBody = ({ resonator }) => (
    <>
        {resonator.link ? (
            <Typography gutterBottom>
                <Link href={resonator.link} target="_blank" rel="noreferrer">
                    {resonator.link}
                </Link>
            </Typography>
        ) : null}
        <Direction by={resonator.content}>
            <Typography>{resonator.content}</Typography>
        </Direction>
    </>
);
