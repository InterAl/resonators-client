import React from "react";
import PropTypes from "prop-types";
import { Edit, Delete } from "@material-ui/icons";
import { Tooltip, IconButton, MenuItem, ListItemIcon } from "@material-ui/core";
import OverflowMenu from "./OverflowMenu";
import { useBelowBreakpoint } from "./hooks";
import _ from 'lodash';

const computeActionKey = (itemId, action) => _.isFunction(action.title) ? action.title(itemId) : action.title.toLowerCase();

const renderShownAction = (itemId) => (action) => (
    <Tooltip title={computeActionKey(itemId, action)} key={computeActionKey(itemId, action)}>
        <IconButton onClick={() => action.onClick(itemId)}>
            {_.isFunction(action.icon) ? action.icon(itemId) : action.icon}
        </IconButton>
    </Tooltip>
);

const renderOverflowAction = (itemId) => (action) => { console.log(computeActionKey(itemId, action)); return (
    <MenuItem onClick={() => action.onClick(itemId)} key={computeActionKey(itemId, action)}>
        {action.icon ?
            <ListItemIcon>
                {_.isFunction(action.icon) ? action.icon(itemId) : action.icon}
            </ListItemIcon> :
            null}
        {action.title}
    </MenuItem>
)};

const isActionAvailable = (itemId) => (action) => action.isAvailable(itemId);

function RowActions({ actions, extraActions, itemId, overflowAllSize = "xs" }) {
    const overflowAll = useBelowBreakpoint(overflowAllSize);

    const shownActions = overflowAll ? [] : actions;
    const overflowActions = (overflowAll ? actions : []).concat(extraActions);

    const isAvailable = isActionAvailable(itemId);

    return [
        ...shownActions.filter(isAvailable).map(renderShownAction(itemId)),
        overflowActions.length ? (
            <OverflowMenu key="more">
                {overflowActions.filter(isAvailable).map(renderOverflowAction(itemId))}
            </OverflowMenu>
        ) : null,
    ];
}

RowActions.propTypes = {
    actions: PropTypes.array,
    extraActions: PropTypes.array,
};

RowActions.defaultProps = {
    actions: [],
    extraActions: [],
};

const rowAction = ({ title, onClick, icon = null, isAvailable = _.stubTrue }) => ({
    icon,
    title,
    onClick,
    isAvailable,
});

rowAction.edit = (onClick) => rowAction({ title: "Edit", icon: <Edit />, onClick });
rowAction.remove = (onClick) => rowAction({ title: "Remove", icon: <Delete />, onClick });

export { RowActions, rowAction };
