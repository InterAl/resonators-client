import React, { useState, useEffect } from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import { push as reroute } from 'connected-react-router';
import { List, ListItem, Avatar } from 'material-ui';
import fetcher from '../api/fetcher';


function ResonatorsOverview(props) {
    // const resonators = { "resonators": [{ "id": "63d215ac-50aa-48ee-8919-f52c938b5ce1", "title": "Me as the embodiment of the self", "content": "bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla bla", "popTime": "2020-07-14T13:20:51.295Z", "popDays": "0,1,2,3,4,5,6", "lastPopTime": "2020-07-23T13:32:31.893Z", "isOneTime": false, "attachments": [{ "id": "adb33624-96de-43c4-ad03-178bd528b18e", "resonator_id": "63d215ac-50aa-48ee-8919-f52c938b5ce1", "media_kind": "picture", "media_format": null, "media_id": null, "title": "Python.png", "visible": 1, "owner_id": null, "owner_role": null, "link": "https://reminders-uploads.s3.amazonaws.com/adb33624-96de-43c4-ad03-178bd528b18e", "created_at": "2020-07-12T19:00:06.118Z", "updated_at": "2020-07-12T19:00:06.118Z" }], "questions": { "total": 2, "answered": 0 } }] }
    const [resonators, setResonators] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetcher("/resonators")
            .then(data => data.resonators)
            .then(setResonators)
            .then(() => setLoading(false));
    });

    return (
        <List>
            {loading ? <div>Loading your resonators...</div> : null}
            {resonators.map(resonator =>
                <ListItem
                    key={resonator.id}
                    primaryText={resonator.title}
                    secondaryText={resonator.content}
                    leftAvatar={
                        <Avatar src={resonator.thumbnail} />
                    }
                />
            )}
        </List>
    )
}


export default ResonatorsOverview

