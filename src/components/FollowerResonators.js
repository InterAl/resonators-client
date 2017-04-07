import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import EntityTable from './EntityTable';
import {actions} from '../actions/followersActions';
import {actions as navigationActions} from '../actions/navigationActions';
import ResonatorImage from './ResonatorImage' ;
import { push } from 'react-router-redux';
// import moment from 'moment';

class FollowerResonators extends Component {
    constructor(props) {
        super(props);

        this.handleRemoveResonator = this.handleRemoveResonator.bind(this);
    }

    componentDidMount() {
        if (this.props.follower)
            this.props.fetchFollowerResonators(this.props.follower.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.follower)
            nextProps.fetchFollowerResonators(nextProps.follower.id);
    }

    getHeader() {
        return [
            'Resonator'
        ];
    }

    handleRemoveResonator(id) {
        this.props.showDeleteResonatorPrompt(id);
    }

    renderColumn(resonator) {
        return (
            <div className='row'>
                <div className='image col-lg-2 col-sm-3 col-xs-6'>
                    <ResonatorImage width={80} height={80} resonator={resonator} />
                </div>
                <div className='name col-lg-10 col-sm-9 col-xs-6'>
                    <b>{resonator.title}</b><br/>
                    {resonator.title}
                </div>
            </div>
        );
    }

    getRows() {
        return _.reduce(this.props.resonators, (acc, r) => {
            // let updatedAt = moment(r.updated_at).format('DD/MM/YYYY hh:mm');
            acc[r.id] = [this.renderColumn(r)];
            return acc;
        }, {});
    }

    render() {
        let rows = this.getRows();
        let header = this.getHeader();
        let addRoute = location.pathname + '/new';
        let getEditRoute = id => `${location.pathname}/${id}/edit`;
        let showRoute = id => `${location.pathname}/${id}/show`;

        return (
            <EntityTable
                selectable={false}
                onAdd={() => this.props.push(addRoute)}
                onEdit={id => this.props.push(getEditRoute(id))}
                onRemove={this.handleRemoveResonator}
                onShow={id => this.props.push(showRoute(id))}
                addButton={true}
                rowActions={['show', 'edit', 'remove']}
                header={header}
                rows={rows}
            />
        );
    }
}

function mapStateToProps(state, {match: {params: {followerId}}}) {
    if (!followerId) return {};

    let follower = _.find(state.followers.followers, f => f.id === followerId);

    return {
        resonators: _.get(follower, 'resonators'),
        follower
    };
}

function mapDispatchToProps(dispatch, /* {params: {followerId}} */) {
    return bindActionCreators({
        fetchFollowerResonators: actions.fetchFollowerResonators,
        showDeleteResonatorPrompt: resonatorId => navigationActions.showModal({
            name: 'deleteResonator',
            props: {
                resonatorId
            }
        }),
        push
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
