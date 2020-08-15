import _ from 'lodash';
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { actions as resonatorActions } from '../actions/resonatorActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';
import resonatorsSelector from '../selectors/resonatorsSelector';

const ResetResonatorPrompt = (props) => {
    console.log({props});
    const handleReset = () => {
        const followerId = props.resonator.follower_id;
        props.reset({ followerId, resonator: props.resonator });
    }
    if (!props.resonator) return null;

    const { resonator: { title } } = props;

    return (
        <SimplePrompt
            title='Reset Resonator'
            text={`Reset [${title}] to group's default?`}
            acceptText='Reset'
            onAccept={handleReset}
            onClose={props.onClose}
            open={props.open}
        />
    );
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
