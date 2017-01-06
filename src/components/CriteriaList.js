import _ from 'lodash';
import {actions as navigationActions} from '../actions/navigationActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import EntityTable from './EntityTable';
import {browserHistory} from 'react-router';

class CriteriaList extends Component {
    constructor(props) {
        super(props);
    }

    renderColumn(criteria) {
        return (
            <div className='row'>
                <div className='name col-lg-10 col-sm-9 col-xs-6'>
                    <b>{criteria.title}</b><br/>
                    {criteria.description}
                </div>
            </div>
        );
    }

    getRows() {
        return _.reduce(this.props.criteria, (acc, c) => {
            acc[c.id] = [this.renderColumn(c)];
            return acc;
        }, {});
    }

    render() {
        let rows = this.getRows();
        let addRoute = browserHistory.getCurrentLocation().pathname + '/new';
        let getEditRoute = id => `${browserHistory.getCurrentLocation().pathname}/${id}/edit`;

        return (
            <EntityTable
                selectable={false}
                onAdd={() => browserHistory.push(addRoute)}
                onEdit={id => browserHistory.push(getEditRoute(id))}
                onRemove={id => this.props.showDeleteCriterionPrompt(id)}
                addButton={true}
                rowActions={['edit', 'remove']}
                header={['Criteria']}
                rows={rows}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        criteria: state.criteria.criteria
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        showDeleteCriterionPrompt: criterionId => navigationActions.showModal({
            name: 'deleteCriterion',
            props: {
                criterionId
            }
        })
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CriteriaList);
