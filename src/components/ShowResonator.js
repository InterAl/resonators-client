import _ from 'lodash';
import {connect} from 'react-redux';
import React, {Component} from 'react';
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
            iframeWidth: scrollWidth * 1.04,
            iframeHeight: scrollHeight + 21
        });
    }

    render() {
        if (!_.get(this.props, 'match.params.resonatorId'))
            return null;

        if (!this.props.resonator)
            return null;

        let resonatorId = this.props.match.params.resonatorId;

        return (
            <div className='showResonator col-xs-12 col-md-10 col-md-offset-1 col-sm-offset-2 col-sm-8'>
                <div className='row sectionTitle'>
                    {this.props.resonator.title}
                </div>
                <hr/>
                <div className='row'>
                    <ExpandableCard
                        onExpandChange={expanded => !expanded && this.setState({
                            iframeWidth: 0, iframeHeight: 0
                        })}
                        width={this.state.iframeWidth || 497}
                        height={this.state.iframeHeight || 60}
                        id={`resonatorPreview-${resonatorId}`}
                        defaultCardData={{
                            expanded: _.size(this.props.resonator.questions) === 0
                        }}
                        title='Resonator Preview'
                        avatar={<ShowIcon/>}
                    >
                        <div style={{height: this.state.iframeHeight}}>
                            {!this.state.iframeHeight &&
                            <CircularProgress style={{margin: '0 auto', display: 'block'}}/>}

                            <iframe
                                onLoad={this.handleIframeLoad}
                                style={{border: 0, height: '100%', width: '100%'}}
                                src={`/api/reminders/${resonatorId}/render`}
                            />
                        </div>
                    </ExpandableCard>
                </div>
                <div style={{marginTop: 30}}>
                    {_.size(this.props.resonator.questions) > 0 && (
                        <div>
                            <div className='sectionTitle'>Criteria</div>
                            <hr/>
                            <ResonatorStats
                                resonatorId={this.props.match.params.resonatorId}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    let resonators = resonatorsSelector(state);

    return {
        resonator: _.find(resonators, r => r.id === ownProps.match.params.resonatorId)
    };
}

function mapDispatchToProps(dispatch) {
    return {dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowResonator);
