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
import { CircularProgress, Typography, Divider, IconButton, Tooltip, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import { RemoveRedEye, GetApp } from "@material-ui/icons";

class ShowResonator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iframeWidth: 0,
            iframeHeight: 0,
        };

        this.handleIframeLoad = this.handleIframeLoad.bind(this);
        this.handleMemberChange = this.handleMemberChange.bind(this);
    }

    componentWillMount() {
        if (this.props.followerGroup) {
            this.props.fetchMembersWithResonatorChildren({
                followerGroupId: this.props.followerGroup.id,
                resonatorId: this.props.resonator.id,
            });
            this.props.followerGroup.members &&
                this.setState({ member: this.props.followerGroup.members[0] });
        }
    }

    componentDidUpdate(prevProps) {
        if (!_.isEqual(prevProps.followerGroup, this.props.followerGroup)) {
            this.setState({ member: this.props.followerGroup.members?.[0] });
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

    renderMemberSelect() {
        return (
            <FormControl variant="outlined">
                <InputLabel id="memberSelectLabel">Member</InputLabel>
                <Select
                    labelId="memberSelectLabel"
                    value={this.state.member}
                    onChange={this.handleMemberChange}
                    label='Member'
                    style={{
                        minWidth: '15vw'
                    }}
                    renderValue={() => this.props.getFollower(this.state.member.id).user.name}
                >
                    {this.props.followerGroup.members.map((member) =>
                        <MenuItem value={member}>
                            {this.props.getFollower(member.id).user.name}
                        </MenuItem>
                    )}
                </Select>
            </FormControl>
        )
    }

    handleMemberChange(event) {
        this.setState({ member: event.target.value });
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

export default connect(mapStateToProps, mapDispatchToProps)(ShowResonator);
