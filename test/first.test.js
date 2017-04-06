import nightmare from './nightmare';

describe('gg', () => {
    beforeEach(() => {
    
    });

    it('description', function() {
        this.timeout(20000);

        return nightmare()
            .goto('/login')
            .end()
            .then(result => console.log('result', result));
    });
});
