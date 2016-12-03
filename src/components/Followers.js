import React, {Component} from 'react';
import {actions} from '../actions/followersActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import followersSelector from '../selectors/followersSelector';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Toggle from 'material-ui/Toggle';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

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
            <div className='col-sm-3'>
                <Toggle
                    toggled={this.state.showEmails}
                    label="Show emails"
                    labelPosition='left'
                    onToggle={() => this.setState({showEmails: !this.state.showEmails})} />
            </div>
            );
        }

        render() {
            return (
                <div className='row'>
                    <div className='col-sm-8 col-sm-offset-2'>
                        <Table>
                            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                <TableRow>
                                    <TableHeaderColumn>
                                        {this.renderClinicFilter()}
                                    </TableHeaderColumn>
                                    <TableHeaderColumn>
                                        {this.renderShowEmailsToggle()}
                                    </TableHeaderColumn>
                                    {this.state.showEmails && <TableHeaderColumn />}
                                </TableRow>
                                <TableRow>
                                    <TableHeaderColumn>Name</TableHeaderColumn>
                                    {this.state.showEmails &&
                                    <TableHeaderColumn>
                                        Email
                                    </TableHeaderColumn>
                                }
                                <TableHeaderColumn>Clinic</TableHeaderColumn>
                            </TableRow>
                        </TableHeader>
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
