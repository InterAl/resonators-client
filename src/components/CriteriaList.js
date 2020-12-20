import _ from "lodash";
import { actions as navigationActions } from "../actions/navigationActions";
import { actions } from "../actions/criteriaActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import React, { Component } from "react";
import EntityTable from "./EntityTable";
import { rowAction } from './RowActions';
import { push } from "connected-react-router";
import { Typography, MenuItem } from "@material-ui/core";
import { PlayCircleFilled, PauseCircleFilled } from "@material-ui/icons";
import OverflowMenu from "./OverflowMenu";
import createSelector from '../selectors/criterionSelector';


class CriteriaList extends Component {
    constructor() {
        super();
       
        this.state = {           
            openedOverflowMenuFollowerId: null,
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
      
        return _.reduce(
            this.props.criteria,
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

                acc[c.id] = cols;
                return acc;
            },
            {}
        );
    }

    getToolbox() {
        return {
            left: <Typography variant="h6">Criterias</Typography>,
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
                isAvailable: (criterionId) => this.props.getCriteria(criterionId).removed,
            }),
            rowAction({
                title: "Deactivate",
                icon: <PauseCircleFilled />,
                onClick: this.handleFreezeCriterion,
                isAvailable: (criterionId) => !this.props.getCriteria(criterionId).removed,
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
                header={["Criteria"]}                            
                rowActions={[
                    rowAction.edit((criterionId) => this.props.push(getEditRoute(criterionId))),                   
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

    return {
        ...criteriaData,
        getCriteria: (criterionId) => _.find(criteriaData.criteria, (c) => c.id === criterionId),       
    };
}

function mapDispatchToProps(dispatch) {   
    return bindActionCreators({           
            unfreezeCriterion: actions.unfreeze,
            toggleDisplayFrozen: actions.toggleDisplayFrozen,
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
