import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { List, ListItem, ListSubheader, ListItemText, ListItemIcon, Checkbox, withTheme } from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RootRef from "@material-ui/core/RootRef";
import criteriaSelector from "../selectors/criteriaSelector";
import "./ResonatorCriteriaSelection.scss";

class ResonatorCriteriaSelection extends Component {
    static propTypes = {
        selectedCriteria: PropTypes.array,
        onReorderCriteria: PropTypes.func,
        onAddCriterion: PropTypes.func,
        onRemoveCriterion: PropTypes.func,
    };

    static defaultProps = {
        onRemoveCriterion: _.noop,
        onAddCriterion: _.noop,
        selectedCriteria: [],
        criteriaOrder: [],
        criteria: [],
    };

    constructor(props) {
        super(props);

        this.onDragEnd = this.onDragEnd.bind(this);
    }

    handleCheck(criterionId, checked) {
        if (checked) {
            this.props.onAddCriterion(criterionId);
        } else {
            this.props.onRemoveCriterion(criterionId);
        }
        this.props.onReorderCriteria(this.getCriteriaSorted().map((criterion, idx) => ({...criterion, order: idx})));
    }

    isCriterionAttached(criterion) {
        return _.some(this.props.selectedCriteria, (id) => id === criterion.id);
    }

    getCriteriaSorted() {
        return _.orderBy(this.props.criteria, (c) => {
            return this.getCriterionOrder(c.id);
        });
    }

    getCriterionOrder(criterionId) {
        const orderIndex = this.props.order.findIndex(x => x === criterionId);
        return (orderIndex >= 0) ? orderIndex : 999;
    }

    onDragEnd(result) {
        if (!result.destination) { // dropped outside the list
            return;
        }

        this.reorderCriterion(result.source.index, result.destination.index);
    }

    reorderCriterion(startIndex, endIndex) {
        const criteria = this.getCriteriaSorted();
        const newCriteria = reorder(criteria, startIndex, endIndex);

        this.props.onReorderCriteria(newCriteria);
    }

    renderCriteria() {
        const criteria = this.getCriteriaSorted();

        return criteria.map((criterion, idx) => (
            <Draggable key={criterion.id} draggableId={criterion.id} index={idx}>
                {(provided, snapshot) => (
                    <ListItem
                        key={idx}
                        className="criterion-selection-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <ListItemIcon>
                            <Checkbox
                                edge="start"
                                color="primary"
                                checked={this.isCriterionAttached(criterion)}
                                onChange={(e, c) => this.handleCheck(criterion.id, c)}
                            />
                        </ListItemIcon>
                        <ListItemText primary={criterion.title} />
                    </ListItem>
                )}
            </Draggable>
        ));
    }

    render() {
        return (
            <div className="resonator-criteria-selection col-xs-12">
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                            <RootRef rootRef={provided.innerRef}>
                                <List
                                    subheader={
                                        <ListSubheader style={{ backgroundColor: this.props.theme.palette.background.paper }}>
                                            Attach criteria to the resonator (optional)
                                        </ListSubheader>
                                    }
                                >
                                    {this.renderCriteria()}
                                </List>
                                {provided.placeholder}
                            </RootRef>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>
        );
    }
}

// helps with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result.map((criterion, idx) => ({...criterion, order: idx}));
};

function mapStateToProps(state) {
    return {
        criteria: criteriaSelector(state)
    };
}

export default connect(mapStateToProps)(withTheme(ResonatorCriteriaSelection));
