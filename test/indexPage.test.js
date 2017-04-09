import nightmare from './nightmare';
import {assert} from 'chai';

describe('first page', () => {
    beforeEach(() => {
    
    });

    it('title should be Resonators', function() {
        return nightmare()
            .goto('/login')
            .evaluate(() => document.title)
            .end()
            .then(title => {
                assert.equal(title, 'Resonators');
            });
    });
});
