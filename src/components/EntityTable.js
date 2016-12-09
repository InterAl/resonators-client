import _ from 'lodash';
import React, {Component} from 'react';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import './EntityTable.scss';

const {PropTypes} = React;

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
        selectable: PropTypes.bool
    };

    static defaultProps = {
        className: '',
        selectable: false
    };

    renderToolbox() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    {_.get(this.props, 'toolbox.left')}
                </ToolbarGroup>
                <ToolbarGroup>
                    {_.get(this.props, 'toolbox.right')}
                    {this.props.addButton &&
                    <FloatingActionButton
                        mini={true}
                        onTouchTap={this.props.onAdd}>
                        <ContentAdd />
                    </FloatingActionButton>}
                </ToolbarGroup>
            </Toolbar>
        );
    }

    renderHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    {this.props.header.map((col, i) => {
                        return (
                            <TableHeaderColumn key={i}>
                                {col}
                            </TableHeaderColumn>
                        );
                    })}
                    {this.props.rowActions &&
                    <TableHeaderColumn className='editColumn'>
                        Actions
                    </TableHeaderColumn>}
                </TableRow>
            </TableHeader>
        );
    }

    renderAction(actionName, id) {
        switch (actionName) {
            case 'edit':
                return (
                    <IconButton onTouchTap={() => this.props.onEdit(id)}>
                        <EditIcon/>
                    </IconButton>
                );

            case 'remove':
                return (
                    <IconButton onTouchTap={() => this.props.onRemove(id)}>
                        <ClearIcon/>
                    </IconButton>
                );

            case 'show':
                return (
                    <IconButton onTouchTap={() => this.props.onShow(id)}>
                        <ShowIcon/>
                    </IconButton>
                );
        }
    }

    renderBody() {
        return (
            <TableBody displayRowCheckbox={false}>
                {_.map(this.props.rows, (v, id) => {
                    return (
                        <TableRow key={id}>
                            {_.map(v, (c, i) => (
                                <TableRowColumn key={i}>
                                    {c}
                                </TableRowColumn>
                            ))}

                            {this.props.rowActions &&
                            <TableRowColumn key='actions' className='editColumn'>
                                {this.props.rowActions.map(actionName => {
                                    return this.renderAction(actionName, id);
                                })}
                            </TableRowColumn>}
                        </TableRow>
                    );
                })}
            </TableBody>
        );
    }

    render() {
        return (
            <div className={`entity-table ${this.props.className} row`}>
                <div className='col-sm-8 col-sm-offset-2'>
                    {(this.props.addButton || this.props.toolbox) &&
                     this.renderToolbox()}
                    <Table selectable={this.props.selectable}>
                        {this.renderHeader()}
                        {this.renderBody()}
                    </Table>
                </div>
            </div>
        );
    }
}
