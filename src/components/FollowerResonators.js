import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import EntityTable from './EntityTable';
import moment from 'moment';
import {browserHistory} from 'react-router';

class FollowerResonators extends Component {
    getHeader() {
        return [
            'Resonator'
        ];
    }

    renderColumn(resonator) {
        return (
            <div className='row'>
                <div className='image col-lg-2 col-sm-3 col-xs-6'>
                    <img src='http://placehold.it/80x80&text=[image]'/>
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
            let updatedAt = moment(r.updated_at).format('DD/MM/YYYY hh:mm');
            acc[r.id] = [this.renderColumn(r)];
            return acc;
        }, {});
    }

    render() {
        let rows = this.getRows();
        let header = this.getHeader();
        // let addRoute = browserHistory.getCurrentLocation() + '/new';

        return (
            <EntityTable
                selectable={false}
                onAdd={() => browserHistory.push('/react/followers/6ea556b1-e79d-45d1-85e0-966ef285a6e0/resonators/new')}
                onEdit={() => console.log('editing')}
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
    let {resonators} = follower;

    return {
        resonators
    };
}

function mapDispatchToProps(dispatch, {params: {followerId}}) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
