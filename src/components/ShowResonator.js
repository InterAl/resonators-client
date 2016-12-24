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
import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import ExpandableCard from './ExpandableCard';
import ResonatorStats from './ResonatorStats';
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

        let resonatorId = this.props.params.resonatorId;

        console.log('gggg', this.props.resonator.questions)
        return (
            <div className='showResonator col-xs-12 col-md-10 col-md-offset-1 col-sm-offset-2 col-sm-8'>
                <ExpandableCard
                    id={`resonatorPreview-${resonatorId}`}
                    title='Resonator Preview'
                    avatar={<ShowIcon/>}
                >
                    <iframe
                        style={{border: 0, height: 800}}
                        src={`/reminders/${resonatorId}/render`}
                    />
                </ExpandableCard>
                {_.size(this.props.resonator.questions) > 0 && (
                    <div>
                        <hr/>
                        <h2 style={{textAlign: 'center'}}>Criteria</h2>
                        <ResonatorStats
                            resonatorId={this.props.params.resonatorId}
                        />
                    </div>
                )}
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
