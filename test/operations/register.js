import Nightmare from '../nightmare';

export default async function register() {
    const name = 'Gully_' + Math.random();
    const email = `gully${Math.random()}@gmail.com`;
    const password = '1234';

    const nightmare = Nightmare()
        .goto('/login')
        .mouseup('.registerBtn')
        .type('.registration-form input[name=\'name\']', name)
        .type('.registration-form input[name=\'email\']', email)
        .type('.registration-form input[name=\'password\']', password)
        .type('.registration-form input[name=\'confirmPassword\']', password)
        .mouseup('.registration-submit')
        .wait('.entity-table');

    await nightmare;

    const [loginCookie] = await nightmare.cookies.get();

    return {
        name,
        email,
        password,
        nightmare,
        authToken: loginCookie.value
    };
}
