import _ from 'lodash';
import React, {Component} from 'react';
import {actions} from '../../../actions/resonatorCreationActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import ResonatorCriteriaSelection from '../../ResonatorCriteriaSelection';
import NavButtons from './navButtons';

class EditResonatorCriteria extends Component {
    constructor() {
        super();

        this.handleAddCriterion = this.handleAddCriterion.bind(this);
        this.handleRemoveCriterion = this.handleRemoveCriterion.bind(this);
        this.handleReorderCriteria = this.handleReorderCriteria.bind(this);
    }

    handleAddCriterion(criterionId) {
        let criteria = this.getSelectedCriteria();

        let nextCriteria = criteria.concat(criterionId);

        this.props.updateCreationStep({
            criteria: nextCriteria
        });
    }

    handleRemoveCriterion(criterionId) {
        let criteria = this.getSelectedCriteria();

        let nextCriteria = _.reject(criteria, id => id === criterionId);

        this.props.updateCreationStep({
            criteria: nextCriteria
        });
    }

    handleReorderCriteria(reorderedCriteria) {
        let order = this.getCriteriaOrder();
        reorderedCriteria.forEach((criterion) => { order[criterion.order] = criterion.id;});
        this.props.updateCreationStep({
            criteriaOrder: order
        });
    }

    getSelectedCriteria() {
        let {criteria = []} = this.props.formData;
        return criteria;
    }

    getCriteriaOrder() {
        let {criteriaOrder = []} = this.props.formData;
        return criteriaOrder;
    }

    render() {
        return (
            <div>
                <ResonatorCriteriaSelection
                    selectedCriteria={this.getSelectedCriteria()}
                    order={this.getCriteriaOrder()}
                    onAddCriterion={this.handleAddCriterion}
                    onRemoveCriterion={this.handleRemoveCriterion}
                    onReorderCriteria={this.handleReorderCriteria}
                />
                {!this.props.editMode && <NavButtons
                    onNext={this.props.onNext}
                    onBack={this.props.onBack}
                />}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        resonator: state.resonatorCreation.resonator,
        formData: state.resonatorCreation.formData
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateCreationStep: actions.updateCreationStep
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonatorCriteria);
