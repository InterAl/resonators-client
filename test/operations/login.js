import Nightmare from '../nightmare';

export default async function login(email, password) {
    return Nightmare()
        .goto('/login')
        .type("input[name='email']", email)
        .type("input[name='password']", password)
        .click('.submitBtn')
        .wait('.entity-table');
}
