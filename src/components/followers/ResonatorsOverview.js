import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router";
import { Typography, Grow, makeStyles } from "@material-ui/core";

import fetcher from "../../api/fetcher";
import ResonatorList from "./ResonatorList";
import SentResonator from "./SentResonator";
import LoadMoreButton from "./LoadMoreButton";
import LoadingOverlay from "./LoadingOverlay";
import { useErrorSnackbar, useConfirmationSnackbar, useLoading } from "../hooks";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
    },
    openResonatorsSubheader: {
        marginBottom: theme.spacing(2),
    },
}));

export default function ResonatorsOverview() {
    const [pages, setPages] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [resonators, setResonators] = useState([]);
    const [activeResonator, setActiveResonator] = useState(null);

    const classes = useStyles();

    const showError = useErrorSnackbar();
    const showConfirmation = useConfirmationSnackbar();

    const [loadingAll, loadAll] = useLoading();
    const [loadingActive, loadActive] = useLoading();
    const [savingAnswer, saveAnswer] = useLoading();

    const history = useHistory();
    const { sentResonatorId } = useParams();

    const finishResonator = (resonatorId) => {
        const resonatorIndex = resonators.findIndex((r) => r.id === resonatorId);
        setResonators(
            resonators
                .slice(0, resonatorIndex)
                .concat({ ...resonators[resonatorIndex], done: true })
                .concat(resonators.slice(resonatorIndex + 1))
        );
    };

    const displayError = (body) => {
        console.log(body)
        showError(body.status);
        return Promise.reject(body);
    };

    const answerQuestion = (resonator, resonatorQuestion, answerId) =>
        saveAnswer(
            fetcher
                .put(`/follower/resonators/${resonator.id}`, {
                    resonatorQuestionId: resonatorQuestion.id,
                    answerId,
                })
                .catch(displayError)
                .then((data) => data.resonator)
                .then((resonator) => {
                    setActiveResonator(resonator);
                    if (resonator.done) finishResonator(resonator);
                })
                .then(() => showConfirmation("Answer saved"))
        );

    useEffect(() => {
        console.log(`Showing ${pages} pages`);
        loadAll(
            fetcher(`/follower/resonators?page=${pages}`)
                .catch(displayError)
                .then((data) => {
                    setTotalCount(data.totalCount);
                    setResonators(resonators.concat(data.resonators));
                })
        );
    }, [pages]);

    useEffect(() => {
        if (sentResonatorId)
            loadActive(
                fetcher(`/follower/resonators/${sentResonatorId}`)
                    .catch(displayError)
                    .then((data) => setActiveResonator(data.resonator))
            );
        else setActiveResonator(null);
    }, [sentResonatorId]);

    const showResonator = (resonator) => history.push(`/follower/resonators/${resonator.id}`);
    const closeResonator = () => history.push("/follower/resonators");

    return (
        <div className={classes.root}>
            {loadingAll || loadingActive ? (
                <LoadingOverlay />
            ) : sentResonatorId && activeResonator ? (
                <SentResonator resonator={activeResonator} answerQuestion={answerQuestion} close={closeResonator} />
            ) : (
                <div>
                    <ResonatorList
                        big
                        onClickItem={showResonator}
                        paperProps={{ elevation: 6 }}
                        resonators={resonators.filter((resonator) => !resonator.done)}
                        subheader={
                            <Typography variant="h6" className={classes.openResonatorsSubheader}>
                                Pending Resonators
                            </Typography>
                        }
                    />
                    <ResonatorList
                        onClickItem={showResonator}
                        paperProps={{ variant: "outlined" }}
                        resonators={resonators.filter((resonator) => resonator.done)}
                        subheader="Finished Resonators"
                    />
                    {resonators.length === totalCount ? null : (
                        <LoadMoreButton text="load older" loading={loadingAll} loadMore={() => setPages(pages + 1)} />
                    )}
                </div>
            )}
        </div>
    );
}
