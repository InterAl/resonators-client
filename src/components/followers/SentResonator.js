import { useSnackbar } from "notistack";
import { useParams } from "react-router";
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
    Link,
    Typography,
    Grow,
    Button,
} from "@material-ui/core";

import Direction from "../Direction";
import fetcher from "../../api/fetcher";
import LoadingOverlay from "./LoadingOverlay";
import ResonatorAnswers from "./ResonatorAnswers";
import ResonatorQuestions from "./ResonatorQuestions";
import { formatResonatorTime } from "./utils";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 200,
        margin: theme.spacing(2, 0),
        backgroundSize: "contain",
    },
    link: {
        textTransform: "none",
    },
}));

export default function SentResonator() {
    const classes = useStyles();
    const { sentResonatorId } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
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

    useEffect(() => {
        setLoading(true);
        fetcher(`/follower/resonators/${sentResonatorId}`)
            .then((data) => data.resonator)
            .then((resonator) => {
                setResonator(resonator);
                setEditMode(!resonator.done);
            })
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
                                            showError={showError}
                                            resonator={resonator}
                                            setResonator={setResonator}
                                        />
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
                </Grow>
            ) : null}
        </>
    );
}

const ResonatorBody = ({ resonator }) => (
    <>
        <Direction by={resonator.content}>
            <Typography paragraph>{resonator.content}</Typography>
        </Direction>
        {resonator.link ? (
            <Typography>
                <Button
                    size="small"
                    color="primary"
                    variant="outlined"
                    startIcon={<LinkIcon />}
                    className={useStyles().link}
                    href={resonator.link}
                    rel="noreferrer"
                    target="_blank"
                >
                    {resonator.link}
                </Button>
            </Typography>
        ) : null}
    </>
);
