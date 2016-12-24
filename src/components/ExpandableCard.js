import _ from 'lodash';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../actions/cardActions';
import {Card, CardHeader, CardText, CardMedia} from 'material-ui/Card';
import React, {Component} from 'react';

class ExpandableCard extends Component {
    static propTypes = {
        title: React.PropTypes.string,
        subtitle: React.PropTypes.string,
        width: React.PropTypes.number,
        margin: React.PropTypes.any,
        style: React.PropTypes.object,
        avatar: React.PropTypes.any,
        id: React.PropTypes.string
    };

    static defaultProps = {
        width: 400,
        margin: '0 auto',
        style: {},
        cardData: {}
    };

    constructor() {
        super();

        this.handleExpandChange = this.handleExpandChange.bind(this);
    }

    handleExpandChange(expanded) {
        if (expanded)
            this.props.expand(this.props.id);
        else
            this.props.contract(this.props.id);
    }

    render() {
        let {expanded} = this.props.cardData;

        return (
            <Card style={{width: this.props.width, margin: this.props.margin, ...this.props.style}}
                  expanded={expanded}
                  onExpandChange={this.handleExpandChange}
            >
                <CardHeader
                    title={this.props.title}
                    subtitle={this.props.subtitle}
                    avatar={this.props.avatar}
                    actAsExpander={true}
                    showExpandableButton={true}
                    expanded={this.props.cardData}
                />
                <CardMedia expandable={true}>
                    {this.props.children}
                </CardMedia>
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
