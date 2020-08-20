import _ from "lodash";
import { connect } from "react-redux";
import React, { Component } from "react";
import { actions as statsActions } from '../actions/resonatorStatsActions';
import { bindActionCreators } from 'redux';
import resonatorsSelector from "../selectors/resonatorsSelector";
import followersSelector from "../selectors/followersSelector";
import followerGroupsSelector from "../selectors/followerGroupsSelector";
import ExpandableCard from "./ExpandableCard";
import ResonatorStats from "./ResonatorStats";
import { CircularProgress, Typography, Divider, IconButton, Tooltip } from "@material-ui/core";
import { RemoveRedEye, GetApp } from "@material-ui/icons";

class ShowResonator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iframeWidth: 0,
            iframeHeight: 0,
        };

        this.handleIframeLoad = this.handleIframeLoad.bind(this);
    }

    handleIframeLoad(ev) {
        let { scrollWidth, scrollHeight } = ev.target.contentWindow.document.body;

        this.setState({
            iframeWidth: scrollWidth * 1.04,
            iframeHeight: scrollHeight + 21,
        });
    }

    renderSectionTitle(title, ...actions) {
        return (
            <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" style={{ textAlign: "center" }} noWrap>
                        {title}
                    </Typography>
                    <div>
                        {actions}
                    </div>
                </div>
                <Divider style={{ margin: 10 }} />
            </div>
        );
    }

    renderDownloadButton(downloadFunc) {
        return (
            <Tooltip title='Download' placement="left">
                <IconButton onClick={() => downloadFunc({ resonatorId: this.props.resonator.id })}>
                    <GetApp />
                </IconButton>
            </Tooltip>
        )
    }

    render() {
        const { follower, followerGroup } = this.props;
        if (!_.get(this.props, "match.params.resonatorId")) return null;

        if (!this.props.resonator) return null;

        let resonatorId = this.props.match.params.resonatorId;

        return (
            <div>
                {this.renderSectionTitle(this.props.resonator.title)}
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
                            expanded: _.size(this.props.resonator.questions) === 0,
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
                {_.size(this.props.resonator.questions) > 0 && (
                    <div style={{ marginTop: 40 }}>
                        {this.renderSectionTitle("Criteria",
                            this.renderDownloadButton(this.props.downloadResonatorStats)
                        )}
                        <ResonatorStats
                            resonatorId={this.props.match.params.resonatorId}
                            follower={follower}
                            followerGroup={followerGroup} />
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const resonators = resonatorsSelector(state);
    const followersData = followersSelector(state)
    const followerGroupsData = followerGroupsSelector(state)

    return {
        resonator: _.find(resonators, (r) => r.id === ownProps.match.params.resonatorId),
        follower: _.find(followersData.followers, (f) => f.id === ownProps.match.params.followerId),
        followerGroup: _.find(followerGroupsData.followerGroups, (fg) => fg.id === ownProps.match.params.followerGroupId),
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        downloadResonatorStats: statsActions.downloadResonatorStats
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowResonator);
