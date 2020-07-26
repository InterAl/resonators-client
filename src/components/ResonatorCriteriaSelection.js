import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, ListItem, ListSubheader, ListItemText, ListItemIcon, Checkbox } from '@material-ui/core';
import criteriaSelector from '../selectors/criteriaSelector';
import './ResonatorCriteriaSelection.scss';

class ResonatorCriteriaSelection extends Component {
    static propTypes = {
        selectedCriteria: PropTypes.array,
        onAddCriterion: PropTypes.func,
        onRemoveCriterion: PropTypes.func
    }

    static defaultProps = {
        onRemoveCriterion: _.noop,
        onAddCriterion: _.noop,
        selectedCriteria: [],
        criteria: []
    }

    handleCheck(criterionId, checked) {
        if (checked) {
            this.props.onAddCriterion(criterionId);
        } else {
            this.props.onRemoveCriterion(criterionId);
        }
    }

    isCriterionAttached(criterion) {
        return !!_.find(this.props.selectedCriteria,
            id => id === criterion.id)
    }

    renderCriteria() {
        const sortedCriteria = _.orderBy(this.props.criteria, c => {
            return this.isCriterionAttached(c) ? 0 : 1;
        });

        return sortedCriteria.map((criterion, idx) => {
            return (
                <ListItem
                    key={idx}
                    className='criterion-selection-item'>
                    <ListItemIcon>
                        <Checkbox
                            edge="start"
                            checked={this.isCriterionAttached(criterion)}
                            onChange={(e, c) => this.handleCheck(criterion.id, c)} />
                    </ListItemIcon>
                    <ListItemText primary={criterion.title} />
                </ListItem>
            );
        });
    }

    render() {
        return (
            <div className='resonator-criteria-selection col-xs-12'>
                <List subheader={
                    <ListSubheader>Attach criteria to the resonator (optional)</ListSubheader>
                }>
                    {this.renderCriteria()}
                </List>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        criteria: criteriaSelector(state)
    };
}

export default connect(mapStateToProps)(ResonatorCriteriaSelection);
