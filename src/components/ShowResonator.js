import _ from "lodash";
import { connect } from "react-redux";
import React, { Component } from "react";
import resonatorsSelector from "../selectors/resonatorsSelector";
import ExpandableCard from "./ExpandableCard";
import ResonatorStats from "./ResonatorStats";
import { CircularProgress, Typography, Divider } from "@material-ui/core";
import { RemoveRedEye } from "@material-ui/icons";

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

    renderSectionTitle(title) {
        return (
            <div style={{ marginBottom: 20 }}>
                <Typography variant="h5" style={{ textAlign: "center" }} noWrap>
                    {title}
                </Typography>
                <Divider style={{ margin: 10 }} />
            </div>
        );
    }

    render() {
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
                        {this.renderSectionTitle("Criteria")}
                        <ResonatorStats resonatorId={this.props.match.params.resonatorId} />
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    let resonators = resonatorsSelector(state);

    return {
        resonator: _.find(resonators, (r) => r.id === ownProps.match.params.resonatorId),
    };
}

function mapDispatchToProps(dispatch) {
    return { dispatch };
}

export default connect(mapStateToProps, mapDispatchToProps)(ShowResonator);
