import _ from 'lodash';
import resonatorsSelector from './resonatorsSelector';

export default function resonatorSelector(state, id) {
    return _.find(resonatorsSelector(state), r => r.id === id);
}
