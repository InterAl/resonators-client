import { useSnackbar } from "notistack";
import { useHistory } from "react-router";
import React, { useEffect, useState } from "react";
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

import api from "../../api";
import Direction from "../Direction";
import AttachedLink from "../AttachedLink";
import LoadingOverlay from "./LoadingOverlay";
import ResonatorQuestionnaire from "./questionnaire/Questionnaire";
import { formatResonatorTime } from "./utils";

const useStyles = makeStyles((theme) => ({
    media: {
        height: 200,
        backgroundSize: "contain",
        margin: theme.spacing(2, 0),
    },
}));

export default function SentResonator({ sentResonatorId, updateResonator }) {
    const classes = useStyles();
    const history = useHistory();
    const { enqueueSnackbar } = useSnackbar();

    const [loading, setLoading] = useState(true);
    const [resonator, setResonator] = useState(null);

    const showError = ({ status }) => {
        enqueueSnackbar(status, {
            variant: "error",
            autoHideDuration: 6000,
            TransitionComponent: Grow,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
            },
        });
        throw { status };
    };

    const answerQuestion = (resonatorQuestionId, answerId) => {
        return api
            .put(`/follower/resonators/${resonator.id}`, {
                resonatorQuestionId,
                answerId,
            })
            .catch(showError)
            .then(({ resonator }) => {
                setResonator(resonator);
                updateResonator(resonator);
            })
            .then(confirmSave);
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
        api.get(`/follower/resonators/${sentResonatorId}`)
            .catch(showError)
            .then(({ resonator }) => {
                setResonator(resonator);
                updateResonator(resonator);
            })
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
                            <Direction by={resonator.content}>
                                <Typography paragraph dangerouslySetInnerHTML={{ __html: resonator.content }} />
                            </Direction>
                            {resonator.link ? <AttachedLink link={resonator.link} /> : null}
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
                        <CardContent>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", direction: "ltr" }}>
                                <div style={{ display: "inline-flex", flexDirection:"column", alignItems: "center" }}>
                                    {resonator.clinic_logo && <img src={resonator.clinic_logo} style={{height:"100px", maxWidth: "150px"}} />}
                                    {resonator.clinic_name && <span>{resonator.clinic_name}</span>}
                                </div>
                                <div style={{ display: "inline-flex", flexDirection:"column", alignItems: "center" }}>
                                    {resonator.clinic_qr && <img src={resonator.clinic_qr} style={{ marginBottom: "10px" }} />}
                                    {resonator.clinic_phone && <a href={'tel:'+resonator.clinic_hone} target="_blank">{resonator.clinic_phone}</a>}
                                    {resonator.clinic_website && <a href={resonator.clinic_website} target="_blank">{resonator.clinic_website}</a>}
                                </div>
                                <div style={{ display: "inline-flex", flexDirection:"column", alignItems: "center" }}>
                                    {resonator.leader_photo && <img src={resonator.leader_photo} style={{height:"100px", maxWidth: "150px"}} />}
                                    {resonator.leader_name && <span>{resonator.leader_name}</span>}
                                </div>
                            </div>
                        </CardContent>
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
