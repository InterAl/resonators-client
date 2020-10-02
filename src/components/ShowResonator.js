import _ from "lodash";
import { connect } from "react-redux";
import React, { Component } from "react";
import { actions as statsActions } from '../actions/resonatorStatsActions';
import { actions as followerGroupsActions } from '../actions/followerGroupsActions';
import { bindActionCreators } from 'redux';
import resonatorsSelector from "../selectors/resonatorsSelector";
import followersSelector from "../selectors/followersSelector";
import followerGroupsSelector from "../selectors/followerGroupsSelector";
import ExpandableCard from "./ExpandableCard";
import ResonatorStats from "./ResonatorStats";
import { CircularProgress, Typography, Divider, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem, withWidth } from "@material-ui/core";
import { RemoveRedEye, GetApp, ChevronRightRounded, ChevronLeftRounded } from "@material-ui/icons";
import { isMobile } from './utils';

class ShowResonator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iframeWidth: 0,
            iframeHeight: 0,
        };

        this.handleIframeLoad = this.handleIframeLoad.bind(this);
        this.handleMemberChange = this.handleMemberChange.bind(this);
        this.handleMemberArrowClick = this.handleMemberArrowClick.bind(this);
    }

    componentWillMount() {
        if (this.props.followerGroup) {
            this.props.fetchMembersWithResonatorChildren({
                followerGroupId: this.props.followerGroup.id,
                resonatorId: this.props.resonator.id,
            });
            this.props.followerGroup.members &&
                this.setState({ member: this.props.followerGroup.members[0], memberIndex: 0 });
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.followerGroup, this.props.followerGroup)) {
            this.setState({ member: this.props.followerGroup.members?.[0], memberIndex: 0 });
        }
    }

    handleIframeLoad(ev) {
        let { scrollWidth, scrollHeight } = ev.target.contentWindow.document.body;

        this.setState({
            iframeWidth: scrollWidth * 1.04,
            iframeHeight: scrollHeight + 21,
        });
    }

    renderSectionTitle({ title, bottomLeftActions, bottomRightActions, rightActions }) {
        return (
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <Typography variant="h5" align='center' noWrap>
                            {title}
                        </Typography>
                    </div>
                    <div>
                        {rightActions}
                    </div>
                </div>
                <Divider style={{ margin: 10 }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        {bottomLeftActions}
                    </div>
                    <div>
                        {bottomRightActions}
                    </div>
                </div>
            </div>
        );
    }

    renderDownloadButton(resonatorId) {
        return (
            <Tooltip title='Download CSV'>
                <IconButton onClick={() => this.props.downloadResonatorStats({ resonatorId })}>
                    <GetApp />
                </IconButton>
            </Tooltip>
        )
    }

    renderNextMemberArrow() {
        const { memberIndex } = this.state;
        return (
            <IconButton
                onClick={() => this.handleMemberArrowClick(() => (memberIndex + 1) % this.props.followerGroup.members.length)}>
                <Tooltip title='Next'>
                    <ChevronRightRounded />
                </Tooltip>
            </IconButton>
        );
    }

    renderPrevMemberArrow() {
        const { memberIndex } = this.state;
        return (
            <IconButton
                onClick={() => this.handleMemberArrowClick(() =>
                    memberIndex - 1 < 0 ? this.props.followerGroup.members.length - 1 : memberIndex - 1)
                }>
                <Tooltip title='Previous'>
                    <ChevronLeftRounded />
                </Tooltip>
            </IconButton>
        );
    }

    renderMemberSelectInput() {
        const { member, memberIndex } = this.state;
        const { getFollower, followerGroup } = this.props;
        return (
            <FormControl variant="outlined">
                <InputLabel id="memberSelectLabel">Member</InputLabel>
                <Select
                    labelId="memberSelectLabel"
                    value={member}
                    onChange={this.handleMemberChange}
                    label='Member'
                    style={{
                        minWidth: '15vw',
                        width: '30vw',
                    }}
                    IconComponent={() => (
                        <Typography className='MuiSelect-icon MuiSelect-iconOutlined' variant='subtitle1'>
                            {memberIndex + 1}/{followerGroup.members.length}
                        </Typography>
                    )}
                    renderValue={() =>
                        _.truncate(getFollower(member.id).user.name, {
                            length: isMobile(this.props.width) ? 15 : 30,
                        })}>
                    {followerGroup.members.map((member) =>
                        <MenuItem value={member}>
                            {getFollower(member.id).user.name}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        )
    }

    renderMemberSelect() {
        return (
            <div style={{ display: "flex" }}>
                {this.renderPrevMemberArrow()}
                {this.renderMemberSelectInput()}
                {this.renderNextMemberArrow()}
            </div>
        )
    }

    handleMemberChange(event) {
        this.setState({
            member: event.target.value,
            memberIndex: _.findIndex(this.props.followerGroup.members, (member) => _.isEqual(member, event.target.value)),
        });
    }

    handleMemberArrowClick(findIndex) {
        const { followerGroup } = this.props;
        const newIndex = findIndex();
        this.setState({
            member: followerGroup.members[newIndex],
            memberIndex: newIndex,
        });
    }

    render() {
        const { follower, followerGroup, getFollower, resonator, getChildResonator } = this.props;
        if (!_.get(this.props, "match.params.resonatorId")) return null;

        if (!resonator) return null;

        const resonatorId = this.props.match.params.resonatorId;
        return (
            <div>
                {this.renderSectionTitle({ title: resonator.title })}
                <div>
                    <ExpandableCard
                        onExpandChange={(expanded) =>
                            !expanded &&
                            this.setState({
                                iframeWidth: 0,
                                iframeHeight: 0,
                            })
                        }
                        width={this.state.iframeWidth || 497}
                        height={this.state.iframeHeight || 60}
                        id={`resonatorPreview-${resonatorId}`}
                        defaultCardData={{
                            expanded: _.size(resonator.questions) === 0,
                        }}
                        title="Resonator Preview"
                        avatar={<RemoveRedEye />}
                    >
                        <div style={{ height: this.state.iframeHeight }}>
                            {!this.state.iframeHeight && (
                                <CircularProgress style={{ margin: "0 auto", display: "block" }} />
                            )}

                            <iframe
                                onLoad={this.handleIframeLoad}
                                style={{ border: 0, height: "100%", width: "100%" }}
                                src={`/api/reminders/${resonatorId}/render`}
                            />
                        </div>
                    </ExpandableCard>
                </div>
                {_.size(resonator.questions) > 0 && (
                    <React.Fragment>
                        <div style={{ marginTop: 40 }}>
                            {this.renderSectionTitle({
                                title: "Criteria",
                                rightActions: this.renderDownloadButton(this.props.resonator.id),
                            })}
                            <ResonatorStats
                                resonatorId={resonatorId}
                                follower={follower}
                                followerGroup={followerGroup} />
                        </div>
                        {followerGroup?.members && this.state.member && (
                            <div style={{ marginTop: 40 }}>
                                {this.renderSectionTitle({
                                    title: 'Member Criteria',
                                    bottomLeftActions: this.renderMemberSelect(),
                                    bottomRightActions: this.renderDownloadButton(getChildResonator(this.state.member.id)?.id),
                                })}
                                <ResonatorStats
                                    resonatorId={(getChildResonator(this.state.member.id))?.id}
                                    follower={getFollower(this.state.member.id)} />
                            </div>
                        )}
                    </React.Fragment>
                )}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const resonators = resonatorsSelector(state);
    const followersData = followersSelector(state)
    const followerGroupsData = followerGroupsSelector(state)
    const resonator = _.find(resonators, (r) => r.id === ownProps.match.params.resonatorId);
    return {
        resonator,
        follower: _.find(followersData.followers, (f) => f.id === ownProps.match.params.followerId),
        followerGroup: _.find(followerGroupsData.followerGroups, (fg) => fg.id === ownProps.match.params.followerGroupId),
        getFollower: (followerId) => _.find(followersData.followers, (f) => f.id === followerId),
        getChildResonator: (followerId) =>
            _.find(resonator.childResonators, (r) =>
                r.parent_resonator_id === ownProps.match.params.resonatorId &&
                r.follower_id === followerId
            ),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        fetchMembersWithResonatorChildren: followerGroupsActions.fetchMembersWithResonatorChildren,
        downloadResonatorStats: statsActions.downloadResonatorStats
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withWidth()(ShowResonator));
