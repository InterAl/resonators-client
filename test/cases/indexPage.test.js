import test from 'ava';
import createNightmare from '../nightmare';
import {assert} from 'chai';
import register from '../operations/register';
import login from '../operations/login';

test('title should be Resonators', async t => {
    const nightmare = createNightmare();

    await nightmare.goto('/login').evaluate(() => document.title)
        .then(title => {
            assert.equal(title, 'Resonators');
        });

    await nightmare.end();

    t.pass();
});

test('login form frame', async t => {
    const nightmare = createNightmare();

    const txt = await nightmare
    .goto('/login')
    .evaluate(() => {
        return document.querySelector('.loginForm').innerText;
    });

    const tl = txt.toLowerCase();
    assert.include(tl, 'submit');
    assert.include(tl, 'registration');
    assert.include(tl, 'forgot password?');

    await nightmare.end();

    t.pass();
});

test('registration form appears after clicking register', async t => {
    const nightmare = createNightmare();

    const exists = await nightmare
        .goto('/login')
        .mouseup('.registerBtn')
        .exists('.registration-form');

    assert.isTrue(exists);

    await nightmare.end();

    t.pass();
});

test('register', async t => {
    const {nightmare, authToken} = await register();
    return nightmare.screenshot('post-submission').end();
});

test('login with registered user', async t => {
    const {user, name, email, password, nightmare} = await register();
    await login(email, password);
    await nightmare.end();
});
