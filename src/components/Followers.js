import React, {Component} from 'react';
import {actions} from '../actions/followersActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import followersSelector from '../selectors/followersSelector';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import IconButton from 'material-ui/IconButton';
import {Toolbar, ToolbarGroup, ToolbarSeparator} from 'material-ui/Toolbar';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import './Followers.scss';

class Followers extends Component {
    constructor() {
        super();

        this.state = {
            showEmails: false
        };

        this.handleClinicFilterChange = this.handleClinicFilterChange.bind(this);
    }

    handleClinicFilterChange(ev, idx, value) {
        this.props.filterByClinicId(value);
    }

    renderFollowers() {
        return this.props.followers.map(f => (
            <TableRow>
                <TableRowColumn>
                <span>
                    {f.user.name}
                </span>
                </TableRowColumn>
                {
                    this.state.showEmails &&
                    <TableRowColumn>
                        {f.user.email}
                    </TableRowColumn>
                }
                <TableRowColumn>
                    {f.clinicName}
                </TableRowColumn>
                <TableRowColumn className='editColumn col-sm-2'>
                    <IconButton>
                        <EditIcon/>
                    </IconButton>
                    <IconButton>
                        <ClearIcon/>
                    </IconButton>
                </TableRowColumn>
            </TableRow>
        ));
    }

    renderClinicFilter() {
        return (
            <SelectField
                floatingLabelText='Clinic'
                value={this.props.clinicIdFilter}
                onChange={this.handleClinicFilterChange}
            >
                <MenuItem value='all' primaryText='All' />
            {
                this.props.clinics.map(clinic => (
                    <MenuItem value={clinic.id} primaryText={clinic.name} />
                ))
            }
            </SelectField>
        );
    }

    renderShowEmailsToggle() {
        return (
            <Toggle
                toggled={this.state.showEmails}
                label="Show emails"
                labelPosition='right'
                onToggle={() => this.setState({showEmails: !this.state.showEmails})} />
        );
    }

    renderToolbox() {
        return (
            <Toolbar>
                <ToolbarGroup>
                    {this.renderClinicFilter()}
                    {this.renderShowEmailsToggle()}
                </ToolbarGroup>
                <ToolbarGroup>
                    <FloatingActionButton mini={true}>
                        <ContentAdd />
                    </FloatingActionButton>
                </ToolbarGroup>
            </Toolbar>
        );
    }

    renderHeader() {
        return (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    {this.state.showEmails &&
                    <TableHeaderColumn>
                        Email
                    </TableHeaderColumn>}
                    <TableHeaderColumn>Clinic</TableHeaderColumn>
                    <TableHeaderColumn className='editColumn'>Actions</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
    }

    render() {
        return (
            <div className='followers row'>
                <div className='col-sm-8 col-sm-offset-2'>
                    {this.renderToolbox()}
                    <Table>
                        {this.renderHeader()}
                        <TableBody displayRowCheckbox={false}>
                            {this.renderFollowers()}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    let followersData = followersSelector(state);

    return {
        ...followersData
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        editFollower: actions.edit,
        filterByClinicId: actions.filterByClinicId
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Followers);
