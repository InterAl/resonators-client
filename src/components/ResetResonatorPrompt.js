import _ from 'lodash';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as resonatorActions } from '../actions/resonatorActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';
import resonatorsSelector from '../selectors/resonatorsSelector';

class ResetResonatorPrompt extends Component {
    constructor() {
        super();

        this.handleReset = this.handleReset.bind(this);
    }

    handleReset() {
        const followerId = this.props.resonator.follower_id;
        this.props.reset({ followerId, resonator: this.props.resonator });
    }

    render() {
        if (!this.props.resonator) return null;

        const { resonator: { title } } = this.props;

        return (
            <SimplePrompt
                title='Reset Resonator'
                text={`Reset ${title} to group's default?`}
                acceptText='Reset'
                onAccept={this.handleReset}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    const resonators = resonatorsSelector(state);
    const { modalProps: { resonatorId } } = navigationInfoSelector(state);
    const resonator = _.find(resonators, r => r.id === resonatorId);

    return {
        resonator,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        reset: resonatorActions.reset,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResetResonatorPrompt);
