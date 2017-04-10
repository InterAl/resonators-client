import nightmare from './nightmare';
import {assert} from 'chai';

describe('first page', function() {
    this.timeout(8000);

    let _nightmare;

    before(() => {
        _nightmare = nightmare().goto('/login');
    });

    after(() => {
        _nightmare.end().then(() => 'ended');
    })

    it('title should be Resonators', function() {
        return _nightmare.evaluate(() => document.title)
            .then(title => {
                assert.equal(title, 'Resonators');
            });
    });

    it('login form frame', function() {
        return _nightmare.evaluate(() => {
            return document.querySelector('.loginForm').innerText;
        }).then(txt => {
            const t = txt.toLowerCase();
            assert.include(t, 'submit');
            assert.include(t, 'registration');
            assert.include(t, 'forgot password?');
        });
    });

    describe('registration', () => {
        before(() => {
            _nightmare = _nightmare.mouseup('.registerBtn');
        });

        it('registration form appears after clicking register', () => {
            return _nightmare.exists('.registration-form').then(assert.isTrue);
        });

        it('register', function() {
            this.timeout(5000);

            return _nightmare
            .type('.registration-form input[name=\'name\']', 'Gully_' + Math.random())
            .type('.registration-form input[name=\'email\']', `gully${Math.random()}@gmail.com`)
            .type('.registration-form input[name=\'password\']', `1234`)
            .type('.registration-form input[name=\'confirmPassword\']', `1234`)
            .mouseup('.registration-submit')
            .wait('.entity-table')
            .screenshot('post-submission');
        });
    });
});
