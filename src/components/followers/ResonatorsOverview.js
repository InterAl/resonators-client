import { useParams } from "react-router";
import React, { useState, useEffect } from "react";
import { Typography, makeStyles } from "@material-ui/core";

import api from "../../api";
import ResonatorList from "./ResonatorList";
import SentResonator from "./SentResonator";
import LoadMoreButton from "./LoadMoreButton";
import LoadingOverlay from "./LoadingOverlay";

const useStyles = makeStyles((theme) => ({
    openResonatorsSubheader: {
        marginBottom: theme.spacing(2),
    },
}));

export default function ResonatorsOverview() {
    const [resonators, setResonators] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPages] = useState(0);

    const classes = useStyles();
    const { sentResonatorId } = useParams();

    function updateResonator(resonator) {
        setResonators(resonators.map((r) => (r.id === resonator.id ? { ...r, done: resonator.done } : r)));
    }

    useEffect(() => {
        setLoading(true);
        api.get(`/follower/resonators?page=${page}`)
            .then((data) => {
                setTotalCount(data.totalCount);
                setResonators(resonators.concat(data.resonators));
            })
            .finally(() => setLoading(false));
    }, [page]);

    return loading ? (
        <LoadingOverlay loading={loading} />
    ) : sentResonatorId ? (
        <SentResonator sentResonatorId={sentResonatorId} onAnswer={updateResonator} />
    ) : (
        <>
            <ResonatorList
                big
                paperProps={{ elevation: 6 }}
                resonators={resonators.filter((resonator) => !resonator.done)}
                subheader={
                    <Typography variant="h6" className={classes.openResonatorsSubheader}>
                        Pending Resonators
                    </Typography>
                }
            />
            <ResonatorList
                paperProps={{ variant: "outlined" }}
                resonators={resonators.filter((resonator) => resonator.done)}
                subheader="Finished Resonators"
            />
            {resonators.length === totalCount ? null : (
                <LoadMoreButton text="load older" loading={loading} loadMore={() => setPages(page + 1)} />
            )}
        </>
    );
}
