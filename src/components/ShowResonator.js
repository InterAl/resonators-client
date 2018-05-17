import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import React, {Component} from 'react';
import { push } from 'react-router-redux';
import resonatorsSelector from '../selectors/resonatorsSelector';
import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
import NextIcon from 'material-ui/svg-icons/av/skip-next';
import PrevIcon from 'material-ui/svg-icons/av/skip-previous';
import EditIcon from 'material-ui/svg-icons/image/edit';
import IconButton from 'material-ui/IconButton';
import ExpandableCard from './ExpandableCard';
import ResonatorStats from './ResonatorStats';
import CircularProgress from 'material-ui/CircularProgress';
import {actions} from '../actions/followersActions';
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

    componentDidMount() {
    }

    nextView(ev) {
        let showRoute = (followerId,resonatorId) => `/followers/${followerId}/resonators/${resonatorId}/show`;
        this.props.push(showRoute(this.props.resonator.follower_id,this.nextId));
    }

    prevView(ev) {
        let showRoute = (followerId,resonatorId) => `/followers/${followerId}/resonators/${resonatorId}/show`;
        this.props.push(showRoute(this.props.resonator.follower_id,this.prevId));
    }

    switchEdit(ev) {
        let getEditRoute = (followerId,resonatorId) => `/followers/${followerId}/resonators/${resonatorId}/edit`;
        this.props.push(getEditRoute(this.props.resonator.follower_id,this.props.resonator.id))
    }

    render() {
        if (!_.get(this.props, 'match.params.resonatorId'))
            return null;

        if (!this.props.resonator)
            return null;

        let resonatorId = this.props.match.params.resonatorId;
        let followerId = this.props.resonator.follower_id;

        //Calc prev and next resonators
        let prevId = null;
        let nextId = null;
        let getNext = false;
        _.each(this.props.resonators,function(val){
            if (val.follower_id !== followerId) return;
            if (getNext) {
                nextId = val.id;
                return false;
            }
            if (val.id == resonatorId) {
                getNext = true;
            } else {
                prevId = val.id;
            }
        });
        this.prevId = prevId;
        this.nextId = nextId;

        return (
            <div className='showResonator col-xs-12 col-md-10 col-md-offset-1 col-sm-offset-2 col-sm-8'>
                <div className='row sectionTitle'>
                    <div className='navButtonsView'>
                        <IconButton onClick={ () => this.prevView() } disabled={this.prevId === null} >< PrevIcon /></IconButton>
                        <IconButton onClick={ () => this.switchEdit() } >< EditIcon /></IconButton>
                        <IconButton onClick={ () => this.nextView() } disabled={this.nextId === null} >< NextIcon /></IconButton>
                    </div>
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
        resonators,
        resonator: _.find(resonators, r => r.id === ownProps.match.params.resonatorId)
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        push
    },dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowResonator);
