import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { push as goto } from "connected-react-router";
import {
    List,
    ListItem,
    ListSubheader,
    ListItemAvatar,
    ListItemText,
    Paper,
    makeStyles,
    Grow,
    Typography,
} from "@material-ui/core";

import ResonatorAvatar from "../ResonatorAvatar";
import { formatResonatorTime } from "./utils";

const useStyles = makeStyles((theme) => ({
    itemBig: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    avatarBig: {
        height: theme.spacing(8),
        width: theme.spacing(8),
        marginRight: theme.spacing(2),
    },
    noResults: {
        textAlign: "center",
    },
}));

function ResonatorList({ resonators, subheader, paperProps = {}, big = false, goto }) {
    const classes = useStyles();
    const listItemClass = big ? classes.itemBig : "";
    const avatarClass = big ? classes.avatarBig : "";

    return (
        <List>
            <ListSubheader>{subheader}</ListSubheader>
            <Paper {...paperProps}>
                {!resonators.length && (
                    <ListItem className={classes.noResults}>
                        <ListItemText primary={<Typography color="textSecondary">Nothing to show yet</Typography>} />
                    </ListItem>
                )}
                {resonators.map((resonator) => (
                    <Grow in key={resonator.id}>
                        <ListItem
                            button
                            divider
                            className={listItemClass}
                            onClick={() => goto(`/follower/resonators/${resonator.id}`)}
                        >
                            {resonator.picture ? (
                                <ListItemAvatar>
                                    <ResonatorAvatar resonator={resonator} className={avatarClass} />
                                </ListItemAvatar>
                            ) : null}
                            <ListItemText
                                inset={!resonator.picture}
                                primary={resonator.title}
                                secondary={formatResonatorTime(resonator.time)}
                                primaryTypographyProps={{ noWrap: true }}
                            />
                        </ListItem>
                    </Grow>
                ))}
            </Paper>
        </List>
    );
}

export default connect(null, (dispatch) => bindActionCreators({ goto }, dispatch))(ResonatorList);
