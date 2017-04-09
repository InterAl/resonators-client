import nightmare from './nightmare';
import {assert} from 'chai';

describe('gg', () => {
    beforeEach(() => {
    
    });

    it('description', function() {
        return nightmare()
            .goto('/login')
            .end()
            .then(result => console.log('result', result))
            .catch(err => {
                console.error(err);
                throw err;
            });
    });
});
