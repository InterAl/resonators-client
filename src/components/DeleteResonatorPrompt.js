import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as resonatorActions } from '../actions/resonatorActions';
import { actions as groupResonatorActions } from '../actions/groupResonatorActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';
import resonatorsSelector from '../selectors/resonatorsSelector';

class DeleteResonatorPrompt extends Component {
    constructor() {
        super();

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
    }

    handleRemoveClick() {
        this.props.isGroup ?
            this.props.removeGroup({ resonator: this.props.resonator }) :
            this.props.remove({ resonator: this.props.resonator });
    }

    render() {
        if (!this.props.resonator) return null;

        let { resonator: { title } } = this.props;

        return (
            <SimplePrompt
                title='Delete Resonator'
                text={`Delete ${title}?`}
                acceptText='Delete'
                onAccept={this.handleRemoveClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    const resonators = resonatorsSelector(state);
    const { modalProps: { resonatorId, isGroup } } = navigationInfoSelector(state);
    const resonator = _.find(resonators, r => r.id === resonatorId);

    return {
        resonator,
        isGroup
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        remove: resonatorActions.remove,
        removeGroup: groupResonatorActions.remove,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteResonatorPrompt);
