import _ from 'lodash';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import React, {Component} from 'react';
import EntityTable from './EntityTable';

class FollowerResonators extends Component {
    render() {
        return (
            <EntityTable
                onAdd={() => console.log('adding')}
                onEdit={() => console.log('editing')}
                onRemove={() => console.log('removing')}
                addButton={true}
                actions={['edit', 'remove']}
                header={['foo', 'bar', 'baz']}
                rows={{
                    1: [1,2,3],
                    2: [4,5,6],
                    3: [7,8,9]
                }}
            />
        );
    }
}

function mapStateToProps(state, {params: {followerId}}) {
    return {
        follower: _.find(state.followers.followers, f => f.id === followerId)
    };
}

function mapDispatchToProps(dispatch, {params: {followerId}}) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
