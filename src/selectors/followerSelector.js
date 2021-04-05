import _ from 'lodash';

export default (state, id) => _.find(state.followers.followers, f => f.id === id) || _.find(state.followers.systemFollowers, f => f.id === id);
