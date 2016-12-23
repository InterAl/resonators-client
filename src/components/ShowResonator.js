import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import EntityTable from './EntityTable';
import {actions} from '../actions/followersActions';
import ResonatorImage from './ResonatorImage' ;
import ResonatorCriteria from './ResonatorCriteria';
import {browserHistory} from 'react-router';
import resonatorsSelector from '../selectors/resonatorsSelector';
import './ShowResonator.scss';

class ShowResonator extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        if (!_.get(this.props, 'params.resonatorId'))
            return null;

        if (!this.props.resonator)
            return null;

        return (
            <div className='showResonator col-xs-12 col-md-10 col-md-offset-1 col-sm-offset-2 col-sm-8'>
                {_.size(this.props.resonator.questions) > 0 &&
                <ResonatorCriteria
                    resonator={this.props.resonator}
                />}
                <iframe
                    style={{
                        height: this.state.iframeHeight,
                        width: this.state.iframeWidth
                    }}
                    style={{height: '100vh', border: 0}}
                    src={`/reminders/${this.props.params.resonatorId}/render`}
                />
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    let resonators = resonatorsSelector(state);

    return {
        resonator: _.find(resonators, r => r.id === ownProps.params.resonatorId)
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowResonator);
