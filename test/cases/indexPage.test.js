import getNightmare from '../nightmare';
import {assert} from 'chai';
import register from '../operations/register';
import login from '../operations/login';

describe('first page', function() {
    let nightmare;

    beforeAll(() => {
        nightmare = getNightmare().goto('/login');
    });

    afterAll(() => {
        nightmare.end().then(() => 'ended');
    })

    it('title should be Resonators', function() {
        return nightmare.evaluate(() => document.title)
            .then(title => {
                assert.equal(title, 'Resonators');
            });
    });

    it('login form frame', function() {
        return nightmare.evaluate(() => {
            return document.querySelector('.loginForm').innerText;
        }).then(txt => {
            const t = txt.toLowerCase();
            assert.include(t, 'submit');
            assert.include(t, 'registration');
            assert.include(t, 'forgot password?');
        });
    });

    describe('registration', () => {
        beforeAll(() => {
            nightmare = nightmare.mouseup('.registerBtn');
        });

        it('registration form appears after clicking register', () => {
            return nightmare.exists('.registration-form').then(assert.isTrue);
        });

        it('register', async function() {
            const {nightmare, authToken} = await register();
            return nightmare.screenshot('post-submission').end();
        });
    });

    it('login with registered user', async () => {
        const {user, name, email, password, nightmare} = await register();
        await nightmare.end();
        await login(email, password);
        await nightmare.end();
    });
}, 10000);
