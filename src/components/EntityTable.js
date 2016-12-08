import _ from 'lodash';
import React, {Component} from 'react';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

const {PropTypes} = React;

export default class EntityTable extends Component {
    static propTypes = {
        rows: PropTypes.object,
        header: PropTypes.array,
        actions: PropTypes.array,
        addButton: PropTypes.bool,
        toolbox: PropTypes.object,
        onAdd: PropTypes.func,
        onEdit: PropTypes.func,
        onRemove: PropTypes.func
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
                    {this.props.actions &&
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

                            {this.props.actions &&
                            <TableRowColumn key='actions' className='editColumn'>
                                {this.props.actions.map((actionName, i) => {
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
            <div className='followers row'>
                <div className='col-sm-8 col-sm-offset-2'>
                    {(this.props.addButton || this.props.toolbox) &&
                     this.renderToolbox()}
                    <Table>
                        {this.renderHeader()}
                        {this.renderBody()}
                    </Table>
                </div>
            </div>
        );
    }
}
