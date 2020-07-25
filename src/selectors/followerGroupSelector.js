import _ from 'lodash';

export default (state, id) => _.find(state.followerGroups.followerGroups, (fg) => fg.id === id);
