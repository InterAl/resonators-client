import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import EntityTable from './EntityTable';
import {actions} from '../actions/followersActions';
import ResonatorImage from './ResonatorImage' ;
// import moment from 'moment';
import {browserHistory} from 'react-router';

class FollowerResonators extends Component {
    constructor(props) {
        super(props);
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
        let addRoute = browserHistory.getCurrentLocation().pathname + '/new';
        let getEditRoute = id => `${browserHistory.getCurrentLocation().pathname}/${id}/edit`;

        return (
            <EntityTable
                selectable={false}
                onAdd={() => browserHistory.push(addRoute)}
                onEdit={id => browserHistory.push(getEditRoute(id))}
                onRemove={() => console.log('removing')}
                addButton={true}
                rowActions={['show', 'edit', 'remove']}
                header={header}
                rows={rows}
            />
        );
    }
}

function mapStateToProps(state, {params: {followerId}}) {
    if (!followerId) return {};

    let follower = _.find(state.followers.followers, f => f.id === followerId);

    return {
        resonators: _.get(follower, 'resonators'),
        follower
    };
}

function mapDispatchToProps(dispatch, /* {params: {followerId}} */) {
    return bindActionCreators({
        fetchFollowerResonators: actions.fetchFollowerResonators
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
