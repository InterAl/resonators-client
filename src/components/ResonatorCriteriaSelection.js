import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import criteriaSelector from '../selectors/criteriaSelector';
import './ResonatorCriteriaSelection.scss';

class ResonatorCriteriaSelection extends Component {
    static propTypes = {
        selectedCriteria: React.PropTypes.array,
        onAddCriterion: React.PropTypes.func,
        onRemoveCriterion: React.PropTypes.func
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
                    className='criterion-selection-item'
                    primaryText={criterion.title}
                    leftCheckbox={
                        <Checkbox
                            defaultChecked={this.isCriterionAttached(criterion)}
                            onCheck={(e, c) => this.handleCheck(criterion.id, c)}
                        />
                    }
                />
            );
        });
    }

    render() {
        return (
            <div className='resonator-criteria-selection col-xs-12'>
                <Subheader>
                    Attach criteria to the resonator (optional)
                </Subheader>
                <List>
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
