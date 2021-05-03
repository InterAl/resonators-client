import _ from "lodash";
import { actions as navigationActions } from "../actions/navigationActions";
import { actions } from "../actions/criteriaActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { Component } from "react";
import EntityTable from "./EntityTable";
import { rowAction } from './RowActions';
import { push } from "connected-react-router";
import {Typography, MenuItem} from "@material-ui/core";
import {PlayCircleFilled, PauseCircleFilled, Edit, ArrowUpward, ArrowDownward} from "@material-ui/icons";
import OverflowMenu from "./OverflowMenu";
import createSelector from '../selectors/criterionSelector';
import Filter from './Filter';


class CriteriaList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openedOverflowMenuFollowerId: null,
            filter: []
        };

        this.handleFreezeCriterion = this.handleFreezeCriterion.bind(this);
        this.handleSelectCriteria = this.handleSelectCriteria.bind(this);
    }

    handleFreezeCriterion(criterionId) {
        this.props.showFreezeCriterionPrompt(criterionId);
    }

    handleSelectCriteria(criterionId) {
        this.props.selectCriteria(criterionId);
    }

    toggleOverflowMenu(criterionId) {
        if (!criterionId && !this.state.openedOverflowMenuCriterionId) return; //prevent stack overflow

        this.setState({
            openedOverflowMenuCriterionId: criterionId,
        });
    }

    getRows() {
        const criteria = this.props.criteria.filter(
            criterion => !this.props.tagsFilter?.length > 0
                || criterion.tags?.split(';').some(item => this.props.tagsFilter?.includes(item.trim()))
        )
        .filter(
            criterion =>
                !this.props.typeFilter?.length > 0
                || criterion.is_system === (this.props.typeFilter.includes("System"))
                || criterion.is_system !== (this.props.typeFilter.includes("Regular"))
        );
        (!this.props.alphabetSort) ? criteria.reverse() : criteria.sort();

        return _.reduce(
            criteria,
            (acc, c) => {
                let cols = [];
                cols.push(
                    <div>
                        <Typography
                            style={{
                                color:  c.removed ? "rgb(157, 155, 155)" : "",
                                fontWeight: c.removed ? "" : "bold",
                                display: "flex",
                                alignItems: "center",
                            }}>

                            {c.removed ? <PauseCircleFilled fontSize="small" style={{ marginRight: 5 }} /> : null}

                            <span>{c.title}</span>
                        </Typography>

                        <Typography style={{ marginLeft: c.removed ? 25 : null }} color="textSecondary">{c.description}</Typography>
                    </div>
                );
                cols.push(
                    <p style={{textAlign:"center"}}>{c.is_system ? "System" : "Regular"}</p>
                )
                cols.push(<div style={{textAlign:"center"}}>
                        {c.tags?.split(';').map((tag) => {
                            if (!tag.trim()) return false;
                            return <span
                                className={(this.props.tagsFilter?.includes(tag.trim())) ? "criterionTag active" : "criterionTag"}
                                onClick={() => this.props.toggleFilterTags(tag.trim())}
                            >{tag};</span>

                        })}
                    </div>
                );

                acc[c.id] = cols;
                return acc;
            },
            {}
        );
    }

    getToolbox() {
        return {
            left: <Typography variant="h6">Criteria</Typography>,
            right: (
                <OverflowMenu keepOpen>
                    <MenuItem onClick={() => this.props.toggleDisplayFrozen()}>
                        {this.props.displayFrozen ? "Hide Deactivated" : "Show Deactivated"}
                    </MenuItem>
                </OverflowMenu>
            ),
        };
    }

    renderOverflowMenu() {
        return (criterionId) =>{
            const criteria = this.props.getCriteria(criterionId);

            return (
                <OverflowMenu key="more-options">
                    {criteria.removed? (
                        <MenuItem onClick={() => this.props.unfreezeCriterion(criterionId)}>Activate</MenuItem>
                    ) : (
                        <MenuItem onClick={() => this.handleFreezeCriterion(criterionId)}>Deactivate</MenuItem>
                    )}
                </OverflowMenu>
            );
        };
    }

    getExtraRowActions() {
        return [
            rowAction({
                title: "Activate",
                icon: <PlayCircleFilled />,
                onClick: this.props.unfreezeCriterion,
                isAvailable: (criterionId) => (!this.props.getCriteria(criterionId)?.is_system || this.props.isAdmin) && this.props.getCriteria(criterionId).removed,
            }),
            rowAction({
                title: "Deactivate",
                icon: <PauseCircleFilled />,
                onClick: this.handleFreezeCriterion,
                isAvailable: (criterionId) => (!this.props.getCriteria(criterionId)?.is_system || this.props.isAdmin) && !this.props.getCriteria(criterionId).removed,
            }),
        ];
    }

    render() {
        const getEditRoute = (id) => `${location.pathname}/${id}/edit`;

        return (
            <EntityTable
                addButton={true}
                addText="Add Criterion"
                rows={this.getRows()}
                header={[
                    <div
                        className="link"
                        onClick={this.props.toggleAlphabetSort.bind(this)}>
                        Criteria {(this.props.alphabetSort) ? <ArrowUpward/> : <ArrowDownward/>}
                    </div>,
                    <Filter
                        name="Type"
                        list={["System", "Regular"]}
                        checkedList={this.props.typeFilter || []}
                        toggleItem={this.props.toggleFilterType.bind(this)}
                        toggleAllItems={this.props.toggleAllFilterTypes.bind(this)}
                    />,
                    this.props.tags.length > 0 ?
                        <Filter
                            name="Tags"
                            list={this.props.tags}
                            checkedList={this.props.tagsFilter || []}
                            toggleItem={this.props.toggleFilterTags.bind(this)}
                            toggleAllItems={this.props.toggleAllFilterTags.bind(this)}
                        /> : "Tags"
                ]}
                rowActions={[
                    rowAction({
                        title: "Edit",
                        icon: <Edit />,
                        onClick: (criterionId) => this.props.push(getEditRoute(criterionId)),
                        isAvailable: (criterionId) => !this.props.getCriteria(criterionId)?.is_system || this.props.isAdmin
                    })
                ]}
                toolbox={this.getToolbox()}
                extraRowActions={this.getExtraRowActions()}
                onAdd={() => this.props.push(location.pathname + "/new")}
                className="Criteria"
            />
        );
    }
}

function mapStateToProps(state) {
    let criteriaData = createSelector(state);
    const isAdmin = state.leaders.leaders.admin_permissions;
    const tags = _.reduce(criteriaData.criteria, (acc, criterion) => {
        criterion.tags?.split(';').forEach(tag => {
            if (!acc.includes(tag.trim()) && tag.trim() !== "") acc.push(tag.trim());
        });
        return acc;
    }, []).sort();

    return {
        ...criteriaData,
        isAdmin,
        getCriteria: (criterionId) => _.find(criteriaData.criteria, (c) => c.id === criterionId),
        tags
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
            unfreezeCriterion: actions.unfreeze,
            toggleDisplayFrozen: actions.toggleDisplayFrozen,
            toggleFilterType: actions.filterType,
            toggleAllFilterTypes: actions.filterTypeAll,
            toggleFilterTags: actions.filterTags,
            toggleAllFilterTags: actions.filterTagsAll,
            toggleAlphabetSort: actions.alphabetSort,
            showDeleteCriterionPrompt: (criterionId) =>
                navigationActions.showModal({
                    name: "deleteCriterion",
                    props: {
                        criterionId,
                    },
                }),
            push,

            showFreezeCriterionPrompt: (criterionId) =>
                navigationActions.showModal({
                    name: "freezeCriterion",
                    props: {
                        criterionId,
                    },
                }),
                selectCriteria: actions.selectCriteria,
        },
        dispatch
    );
}



export default connect(mapStateToProps, mapDispatchToProps, null, { pure: false })(CriteriaList);
