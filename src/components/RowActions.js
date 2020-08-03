import React from "react";
import PropTypes from "prop-types";
import { Edit, Delete } from "@material-ui/icons";
import { Tooltip, IconButton, MenuItem, ListItemIcon, useTheme, useMediaQuery } from "@material-ui/core";

import OverflowMenu from "./OverflowMenu";

const computeActionKey = (action) => action.title.toLowerCase();

const renderShownAction = (itemId) => (action) => (
    <Tooltip title={action.title} key={computeActionKey(action)}>
        <IconButton onClick={() => action.onClick(itemId)}>{action.icon}</IconButton>
    </Tooltip>
);

const renderOverflowAction = (itemId) => (action) => (
    <MenuItem onClick={() => action.onClick(itemId)} key={computeActionKey(action)}>
        {action.icon ? <ListItemIcon>{action.icon}</ListItemIcon> : null}
        {action.title}
    </MenuItem>
);

const isActionAvailable = (itemId) => (action) => action.isAvailable(itemId);

function RowActions({ actions, extraActions, itemId, overflowAllSize = "sm" }) {
    const overflowAll = useMediaQuery(useTheme().breakpoints.down(overflowAllSize));

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
