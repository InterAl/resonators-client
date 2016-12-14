import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {actions} from '../actions/resonatorCreationActions';
import {List, ListItem} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Subheader from 'material-ui/Subheader';
import Icon from 'material-ui/svg-icons/action/question-answer';
import criteriaSelector from '../selectors/criteriaSelector';
import './ResonatorCriteriaSelection.scss';

class ResonatorCriteriaSelection extends Component {
    static propTypes = {
        resonator: React.PropTypes.object,
        onAddCriterion: React.PropTypes.func,
        onRemoveCriterion: React.func
    }

    static defaultProps = {
        onRemoveCriterion: _.noop,
        onAddCriterion: _.noop,
        resonator: {
            questions: []
        },
        criteria: []
    }

    handleCheck(criterionId, checked) {
        if (checked) {
            this.props.onAddCriterion(criterionId);
        } else {
            this.props.onRemoveCriterion(criterionId);
        }
    }

    getAttachedCriteria() {
        return _.get(this.props.resonator, 'questions', []);
    }

    isCriterionAttached(criterion) {
        return _.find(this.getAttachedCriteria(),
                      c => c.id === criterion.id)
    }

    renderCriteria() {
        return this.props.criteria.map(criterion => {
            return (
                <ListItem
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
            <div className='resonator-criteria-selection'>
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
