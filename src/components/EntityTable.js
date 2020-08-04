import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Toolbar, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper } from "@material-ui/core";

import Fab from "./Fab";
import "./EntityTable.scss";
import { RowActions } from "./RowActions";

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
        addText: PropTypes.string,
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
                    {((this.props.rowActions && !_.isEmpty(this.props.rowActions)) ||
                        (this.props.extraRowActions && !_.isEmpty(this.props.rowActions))) && (
                        <TableCell className="editColumn">Actions</TableCell>
                    )}
                </TableRow>
            </TableHead>
        );
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

                            <TableCell key="actions" className="editColumn">
                                <RowActions
                                    itemId={itemId}
                                    actions={this.props.rowActions}
                                    extraActions={this.props.extraRowActions}
                                />
                            </TableCell>
                        </TableRow>
                    );
                })
                }
            </TableBody >
        );
    }

    render() {
        return (
            <div className={`entity-table ${this.props.className}`}>
                <Paper>
                    {(this.props.addButton || this.props.toolbox) && this.renderToolbox()}
                    <TableContainer>
                        <Table>
                            {this.props.header && this.renderHeader()}
                            {this.props.rows && this.renderBody()}
                        </Table>
                    </TableContainer>
                </Paper>
                {this.props.addButton && <Fab onClick={this.props.onAdd} text={this.props.addText} />}
            </div>
        );
    }
}
