import _ from 'lodash';

export default (state, id) => _.find(state.followers.followers, f => f.id === id);
