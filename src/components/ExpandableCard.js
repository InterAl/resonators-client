import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/cardActions';
import { Card, CardHeader, CardMedia, IconButton, Collapse } from '@material-ui/core';
import { ExpandMore, ExpandLess } from '@material-ui/icons';
import React, { Component } from 'react';
import PropTypes from 'prop-types';


class ExpandableCard extends Component {
    static propTypes = {
        title: PropTypes.string,
        subtitle: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        margin: PropTypes.any,
        style: PropTypes.object,
        avatar: PropTypes.any,
        id: PropTypes.string,
        onExpandChange: PropTypes.func
    };

    static defaultProps = {
        width: "max-content",
        margin: '0 auto',
        style: {},
        defaultCardData: {},
        onExpandChange: _.noop
    };

    constructor(props) {
        super(props);

        this.handleExpandChange = this.handleExpandChange.bind(this);
        this.toggleExpanded = this.toggleExpanded.bind(this);
        const { initiallyExpanded } = this.props.cardData || this.props.defaultCardData;

        this.state = {
            expanded: Boolean(initiallyExpanded)
        }
    }

    handleExpandChange(expanded) {
        if (expanded)
            this.props.expand(this.props.id);
        else
            this.props.contract(this.props.id);

        this.props.onExpandChange(expanded);
    }

    toggleExpanded() {
        const newState = !this.state.expanded;
        this.setState({ expanded: newState })
        this.handleExpandChange(newState)
    }

    render() {
        return (
            <Card style={{ maxWidth: '100vw', width: this.props.width, margin: this.props.margin, ...this.props.style }}>
                <CardHeader
                    title={this.props.title}
                    subheader={this.props.subtitle}
                    avatar={this.props.avatar}
                    action={
                        <IconButton onClick={this.toggleExpanded}>
                            {this.state.expanded ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    } />
                <Collapse in={this.state.expanded}>
                    <CardMedia style={{ height: this.props.height }}>
                        {this.props.children}
                    </CardMedia>
                </Collapse>
            </Card>
        );
    }
}

function mapStateToProps(state, ownProps) {
    let card = _.find(state.cards.cards, c => c.id === ownProps.id);

    return {
        cardData: card
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        expand: actions.expand,
        contract: actions.contract
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ExpandableCard);
