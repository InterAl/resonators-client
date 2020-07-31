import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Edit, Clear, Add, RemoveRedEye } from "@material-ui/icons";
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
    Divider,
} from "@material-ui/core";
import "./EntityTable.scss";

export default class EntityTable extends Component {
    static propTypes = {
        rows: PropTypes.object,
        header: PropTypes.array,
        rowActions: PropTypes.array,
        addButton: PropTypes.bool,
        toolbox: PropTypes.object,
        onAdd: PropTypes.func,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func,
        onShow: PropTypes.func,
        className: PropTypes.string,
    };

    static defaultProps = {
        className: "",
    };

    renderToolbox() {
        const left = _.get(this.props, "toolbox.left");
        const right = _.get(this.props, "toolbox.right");
        return (
            (left || right) && (
                <div>
                    <Toolbar style={{ justifyContent: "space-between", padding: "0 16px" }}>
                        <div>{left}</div>
                        <div>{right}</div>
                    </Toolbar>
                    <Divider />
                </div>
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

    renderAction(action, id) {
        if (typeof action === "function") return action(id);

        switch (action) {
            case "edit":
                return (
                    <IconButton key={action} onClick={() => this.props.onEdit(id)}>
                        <Edit />
                    </IconButton>
                );

            case "remove":
                return (
                    <IconButton key={action} onClick={() => this.props.onRemove(id)}>
                        <Clear />
                    </IconButton>
                );

            case "show":
                return (
                    <IconButton key={action} onClick={() => this.props.onShow(id)}>
                        <RemoveRedEye />
                    </IconButton>
                );
        }
    }

    renderBody() {
        return (
            <TableBody>
                {_.map(this.props.rows, (row, id) => {
                    return (
                        <TableRow key={id}>
                            {_.map(row, (column, index) => (
                                <TableCell key={index}>{column}</TableCell>
                            ))}

                            {this.props.rowActions && (
                                <TableCell key="actions" className="editColumn">
                                    {this.props.rowActions.map((action) => {
                                        return this.renderAction(action, id);
                                    })}
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
