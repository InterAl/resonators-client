import fetcher from "../../api/fetcher";
import React, { useState, useEffect } from "react";
import { List, ListItem, ListSubheader, ListItemAvatar, ListItemText, Avatar } from "@material-ui/core";

export default function ResonatorsOverview(props) {
    const [resonators, setResonators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetcher("/follower/resonators")
            .then((data) => data.resonators)
            .then(setResonators)
            .then(() => setLoading(false));
    });

    return (
        <List>
            <ListSubheader>Your Resonators</ListSubheader>
            {loading ? <div>Loading your resonators...</div> : null}
            {resonators.map((resonator) => (
                <ListItem key={resonator.id}>
                    <ListItemAvatar>
                        <Avatar src={resonator.thumbnail} />
                    </ListItemAvatar>
                    <ListItemText primary={resonator.title} secondary={resonator.content} />
                </ListItem>
            ))}
        </List>
    );
}
