import { useParams } from "react-router";
import React, { useEffect, useState } from "react";
import {
    makeStyles,
    Card,
    CardHeader,
    CardMedia,
    CardContent,
    Typography,
    Link,
    Divider,
    Grow,
    CircularProgress,
    Backdrop,
    Button,
    CardActions,
    Slide,
} from "@material-ui/core";

import Bidi from "../Bidi";
import Toast from "../Toast";
import fetcher from "../../api/fetcher";
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
    error: {
        backgroundColor: theme.palette.error.main,
        alignItems: "center",
    },
}));

export default function SentResonator() {
    const classes = useStyles();

    const { sentResonatorId } = useParams();

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [resonator, setResonator] = useState(null);
    const [changesSaved, setChangesSaved] = useState(false);
    const [activeQuestion, setActiveQuestion] = useState(0);

    const showError = (response) => response.json().then(({ status }) => setError(status));

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
            .then(() => setChangesSaved(true))
            .catch(showError);
    };

    return (
        <>
            <LoadingIndicator loading={loading} />
            <ErrorIndicator error={error} close={() => setError("")} />
            <SaveIndicator shown={changesSaved} close={() => setChangesSaved(false)} />

            {!loading && resonator ? (
                <Grow in>
                    <Card>
                        <CardHeader
                            title={<Bidi fullWidth>{resonator.title}</Bidi>}
                            subheader={formatResonatorTime(resonator.time)}
                            titleTypographyProps={{ gutterBottom: true }}
                        />
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

const LoadingIndicator = ({ loading }) =>
    loading ? (
        <Backdrop open invisible>
            <CircularProgress />
        </Backdrop>
    ) : null;

const ErrorIndicator = ({ error, close }) => {
    const classes = useStyles();

    return (
        <Toast
            close={close}
            message={error}
            hideAfter={null}
            open={Boolean(error)}
            ContentProps={{ className: classes.error }}
        />
    );
};

const SaveIndicator = ({ shown, close }) => (
    <Toast
        open={shown}
        close={close}
        hideAfter={2000}
        message="Answer saved"
        TransitionComponent={Slide}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    />
);

const ResonatorBody = ({ resonator }) => (
    <>
        <Typography gutterBottom>
            <Link href={resonator.link} target="_blank" rel="noreferrer">
                {resonator.link}
            </Link>
        </Typography>
        <Typography>
            <Bidi fullWidth>{resonator.content}</Bidi>
        </Typography>
    </>
);
