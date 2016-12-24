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
import CircularProgress from 'material-ui/CircularProgress';
import './ShowResonator.scss';

class ShowResonator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iframeWidth: 0,
            iframeHeight: 0
        };

        this.handleIframeLoad = this.handleIframeLoad.bind(this);
    }

    handleIframeLoad(ev) {
        let {scrollWidth, scrollHeight} = ev.target.contentWindow.document.body;

        this.setState({
            iframeWidth: scrollWidth,
            iframeHeight: scrollHeight
        });
    }

    render() {
        if (!_.get(this.props, 'params.resonatorId'))
            return null;

        if (!this.props.resonator)
            return null;

        let resonatorId = this.props.params.resonatorId;

        return (
            <div className='showResonator col-xs-12 col-md-10 col-md-offset-1 col-sm-offset-2 col-sm-8'>
                <ExpandableCard
                    onExpandChange={expanded => !expanded && this.setState({
                        iframeWidth: 0, iframeHeight: 0
                    })}
                    id={`resonatorPreview-${resonatorId}`}
                    title='Resonator Preview'
                    avatar={<ShowIcon/>}
                >
                    <div>
                        {!this.state.iframeHeight &&
                        <CircularProgress style={{margin: '0 auto', display: 'block'}}/>}

                        <iframe
                            onLoad={this.handleIframeLoad}
                            style={{border: 0, height: this.state.iframeHeight}}
                            src={`/reminders/${resonatorId}/render`}
                        />
                    </div>
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
