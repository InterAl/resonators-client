import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/criteriaActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';

class DeleteCriterionPrompt extends Component {
    constructor() {
        super();

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick() {
        this.props.deleteCriterion(this.props.criterion.id);
    }

    render() {
        if (!this.props.criterion) return null;

        let {criterion: {title}} = this.props;

        return (
            <SimplePrompt
                title='Delete Criterion?'
                acceptText='Delete'
                text={`Delete ${title}?`}
                onAccept={this.handleRemoveClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    let {modalProps: {criterionId}} = navigationInfoSelector(state);
    let criterion = _.find(state.criteria.criteria, c => c.id === criterionId);

    return {
        criterion
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        deleteCriterion: actions.deleteCriterion,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteCriterionPrompt);
