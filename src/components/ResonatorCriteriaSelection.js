import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { List, ListItem, ListSubheader, ListItemText, ListItemIcon, Checkbox, withTheme } from "@material-ui/core";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import RootRef from "@material-ui/core/RootRef";
import criteriaSelector from "../selectors/criteriaSelector";
import "./ResonatorCriteriaSelection.scss";
import Filter from "components/Filter";

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

        this.state = {
            filter: []
        };

        this.onDragEnd = this.onDragEnd.bind(this);
        this.toggleAllItems = this.toggleAllItems.bind(this);
        this.toggleItem = this.toggleItem.bind(this);
    }

    handleCheck(criterionId, checked) {
        if (checked) {
            this.props.onAddCriterion(criterionId);
        } else {
            this.props.onRemoveCriterion(criterionId);
        }

        /**
         * Assign the order for all criteria (including unchecked).
         * Typically it'd make sense to put this in ComponentDidMount but this.props.criteria is not available there (it's defined later on inside mapStateToProps())
         */
        this.props.onReorderCriteria(
            this.getCriteriaSorted().map((criterion, idx) => ({...criterion, order: idx}))
        );

        /**
         * Reposition criterion on check/uncheck
         */
        this.repositionCriterion(
            this.getCriterionOrder(criterionId),
            (checked) ? this.props.selectedCriteria.length  : this.props.criteria.length - 1
        );
    }

    isCriterionAttached(criterion) {
        return _.some(this.props.selectedCriteria, (id) => id === criterion.id);
    }

    getCriteriaSorted() {
        const sorted = this.props.criteria;
        sorted.sort((a, b) =>
            this.isCriterionAttached(b) - this.isCriterionAttached(a) ||
            this.getCriterionOrder(a.id) - this.getCriterionOrder(b.id) ||
            a.title.localeCompare(b.title)
        );
        return sorted;
    }

    getCriterionOrder(criterionId) {
        const orderIndex = this.props.order.findIndex(x => x === criterionId);
        return (orderIndex >= 0) ? orderIndex : 999;
    }

    onDragEnd(result) {
        if (!result.destination) { // dropped outside the list
            return;
        }

        this.repositionCriterion(result.source.index, result.destination.index);
    }

    repositionCriterion(startIndex, endIndex) {
        const criteria = this.getCriteriaSorted();
        const newCriteria = reorder(criteria, startIndex, endIndex);

        this.props.onReorderCriteria(newCriteria);
    }

    renderCriteria() {
        const criteria = this.getCriteriaSorted()
            .filter(c => this.isCriterionAttached(c) === true || c.removed === false)
            .filter(
                criterion => !this.state.filter.length > 0
                    || criterion.tags?.split(';').some(item => this.state.filter.includes(item.trim()))
            )
        ;

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

    filterItems(activeTags) {
        if (_.isEqual(activeTags.sort(), this.props.tags.sort())) {
            this.setState({filter: this.props.tags});
        } else {
            this.setState({filter: activeTags});
        }
    }

    toggleAllItems() {
        let filter = this.state.filter;
        if (_.isEqual(filter.sort(), this.props.tags.sort())) {
            filter = [];
            this.setState({filter});
        } else {
            filter = this.props.tags;
            this.setState({filter});
        }
        this.filterItems(filter);
    }

    toggleItem(item) {
        let filter = this.state.filter;
        if (filter.includes(item)) {
            filter = _.reject(filter, (filter) => filter === item);
            this.setState({filter});
        } else {
            filter.push(item);
            this.setState({filter});
        }
        this.filterItems(filter);
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
                                            Attach criteria to the resonator (optional). <br/>Drag to reorder
                                            {this.props.tags.length > 0 ?
                                                <Filter
                                                    name="Tags"
                                                    list={this.props.tags}
                                                    checkedList={this.state.filter}
                                                    filterItems={this.filterItems.bind(this)}
                                                    toggleItem={this.toggleItem.bind(this)}
                                                    toggleAllItems={this.toggleAllItems.bind(this)}
                                                /> : "Tags"}
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
    const criteria = criteriaSelector(state);
    const tags = _.reduce(criteria, (acc, criterion) => {
        criterion.tags?.split(';').forEach(tag => {
            if (!acc.includes(tag.trim()) && tag.trim() !== "") acc.push(tag.trim());
        });
        return acc;
    }, []).sort();

    return {
        criteria,
        tags
    };
}

export default connect(mapStateToProps)(withTheme(ResonatorCriteriaSelection));
