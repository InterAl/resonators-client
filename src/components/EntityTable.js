import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Edit, Delete, Add } from "@material-ui/icons";
import {
    IconButton,
    Fab,
    Toolbar,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Paper,
    Tooltip,
    MenuItem,
    ListItemIcon,
} from "@material-ui/core";
import OverflowMenu from "./OverflowMenu";
import isMobile from "./isMobile";
import "./EntityTable.scss";

export default class EntityTable extends Component {
    static propTypes = {
        rows: PropTypes.object,
        header: PropTypes.array,
        rowActions: PropTypes.array,
        extraRowActions: PropTypes.array,
        addButton: PropTypes.bool,
        toolbox: PropTypes.object,
        onAdd: PropTypes.func,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: "",
        rowActions: [],
        extraRowActions: []
    };

    renderToolbox() {
        const left = _.get(this.props, "toolbox.left");
        const right = _.get(this.props, "toolbox.right");
        return (
            (left || right) && (
                <Paper elevation={2}>
                    <Toolbar style={{ justifyContent: "space-between" }}>
                        <div>{left}</div>
                        <div>{right}</div>
                    </Toolbar>
                </Paper>
            )
        );
    }

    renderHeader() {
        return (
            <TableHead>
                <TableRow>
                    {this.props.header.map((col, index) => (
                        <TableCell key={index}>{col}</TableCell>
                    ))}
                    {this.props.rowActions && <TableCell className="editColumn">Actions</TableCell>}
                </TableRow>
            </TableHead>
        );
    }

    computeActionKey(action) {
        return action.title.toLowerCase();
    }

    renderShownAction(itemId) {
        return (action) => (
            <Tooltip title={action.title} key={this.computeActionKey(action)}>
                <IconButton onClick={() => action.onClick(itemId)}>{action.icon}</IconButton>
            </Tooltip>
        );
    }

    renderOverflowAction(itemId) {
        return (action) => (
            <MenuItem onClick={() => action.onClick(itemId)} key={this.computeActionKey(action)}>
                {action.icon ? <ListItemIcon>{action.icon}</ListItemIcon> : null}
                {action.title}
            </MenuItem>
        );
    }

    isActionAvailable(itemId) {
        return (action) => action.isAvailable(itemId);
    }

    renderRowActions(itemId) {
        const shownActions = isMobile() ? [] : this.props.rowActions;
        const overflowActions = (isMobile() ? this.props.rowActions : []).concat(this.props.extraRowActions);

        const isAvailable = this.isActionAvailable(itemId)

        return [
            ...shownActions.filter(isAvailable).map(this.renderShownAction(itemId)),
            overflowActions.length ? (
                <OverflowMenu key="more">
                    {overflowActions.filter(isAvailable).map(this.renderOverflowAction(itemId))}
                </OverflowMenu>
            ) : null,
        ];
    }

    renderBody() {
        return (
            <TableBody>
                {_.map(this.props.rows, (row, itemId) => {
                    return (
                        <TableRow key={itemId}>
                            {_.map(row, (column, index) => (
                                <TableCell key={index}>{column}</TableCell>
                            ))}

                            {this.props.rowActions && (
                                <TableCell key="actions" className="editColumn">
                                    {this.renderRowActions(itemId)}
                                </TableCell>
                            )}
                        </TableRow>
                    );
                })}
            </TableBody>
        );
    }

    render() {
        return (
            <div className={`entity-table ${this.props.className}`}>
                <Paper>
                    {(this.props.addButton || this.props.toolbox) && this.renderToolbox()}
                    <TableContainer>
                        <Table>
                            {this.renderHeader()}
                            {this.renderBody()}
                        </Table>
                    </TableContainer>
                </Paper>
                {this.props.addButton && (
                    <div className="add-btn">
                        <Fab color="primary" onClick={this.props.onAdd}>
                            <Add />
                        </Fab>
                    </div>
                )}
            </div>
        );
    }
}

const rowAction = ({ title, onClick, icon = null, isAvailable = _.stubTrue }) => ({
    icon,
    title,
    onClick,
    isAvailable,
});

rowAction.edit = (onClick) => rowAction({ title: "Edit", icon: <Edit />, onClick });
rowAction.remove = (onClick) => rowAction({ title: "Remove", icon: <Delete />, onClick });

export { rowAction };
