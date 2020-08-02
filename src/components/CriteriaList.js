import _ from "lodash";
import { actions as navigationActions } from "../actions/navigationActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { Component } from "react";
import EntityTable, { rowAction } from "./EntityTable";
import { push } from "connected-react-router";
import { Typography } from "@material-ui/core";

class CriteriaList extends Component {
    constructor(props) {
        super(props);
    }

    renderColumn(criteria) {
        return (
            <div>
                <Typography style={{ fontWeight: "bold" }}>{criteria.title}</Typography>
                <Typography color="textSecondary">{criteria.description}</Typography>
            </div>
        );
    }

    getRows() {
        return _.reduce(
            this.props.criteria,
            (acc, c) => {
                acc[c.id] = [this.renderColumn(c)];
                return acc;
            },
            {}
        );
    }

    render() {
        const getEditRoute = (id) => `${location.pathname}/${id}/edit`;

        return (
            <EntityTable
                addButton={true}
                rows={this.getRows()}
                header={["Criteria"]}
                onAdd={() => this.props.push(location.pathname + "/new")}
                rowActions={[
                    rowAction.edit((criterionId) => this.props.push(getEditRoute(criterionId))),
                    rowAction.remove((criterionId) => this.props.showDeleteCriterionPrompt(criterionId))
                ]}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        criteria: state.criteria.criteria,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            showDeleteCriterionPrompt: (criterionId) =>
                navigationActions.showModal({
                    name: "deleteCriterion",
                    props: {
                        criterionId,
                    },
                }),
            push,
        },
        dispatch
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(CriteriaList);
