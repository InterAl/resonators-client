import fetcher from "../../api/fetcher";
import React, { useState, useEffect } from "react";
import { Typography, makeStyles } from "@material-ui/core";

import ResonatorList from "./ResonatorList";
import LoadMoreButton from "./LoadMoreButton";

const useStyles = makeStyles((theme) => ({
    openResonatorsSubheader: {
        marginBottom: theme.spacing(2),
    },
}));

export default function ResonatorsOverview(props) {
    const [resonators, setResonators] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPages] = useState(0);

    const classes = useStyles();

    useEffect(() => {
        setLoading(true);
        fetcher(`/follower/resonators?page=${page}`)
            .then((data) => {
                setTotalCount(data.totalCount);
                setResonators(resonators.concat(data.resonators));
            })
            .then(() => setLoading(false));
    }, [page]);

    return (
        <>
            {!resonators.length && loading ? <Typography variant="h6">Loading your resonators...</Typography> : null}
            <ResonatorList
                big
                paperProps={{ elevation: 6 }}
                resonators={resonators.filter((resonator) => !resonator.done)}
                subheader={
                    <Typography variant="h6" className={classes.openResonatorsSubheader}>
                        Open Resonators
                    </Typography>
                }
            />
            <ResonatorList
                paperProps={{ variant: "outlined" }}
                resonators={resonators.filter((resonator) => resonator.done)}
                subheader="Answered Resonators"
            />
            {resonators.length === totalCount ? null : (
                <LoadMoreButton text="load older" loading={loading} loadMore={() => setPages(page + 1)} />
            )}
        </>
    );
}
