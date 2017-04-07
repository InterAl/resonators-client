import _ from 'lodash';
import criteriaSelector from './criteriaSelector';

export default function criterionSelector(state, id) {
    const criteria = criteriaSelector(state);
    return _.find(criteria, c => c.id === id);
}
