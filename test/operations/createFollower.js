import Nightmare from '../nightmare';
import selectFieldTestkit from '../testkits/selectField';

export default async function createFollower({
    nightmare = Nightmare(),
    email,
    password
}) {
    const follower = {
        name: `follower_${Math.random()}`,
        email: `follower_${Math.random()}@gmail.com`,
        password: '1234'
    };

    await nightmare
        .goto('/followers')
        .wait('.entity-table')
        .mouseup('.add-btn button')
        .type(".edit-follower-modal input[name='name']", follower.name)
        .type(".edit-follower-modal input[name='email']", follower.email)
        .type(".edit-follower-modal input[name='password']", follower.password);

    const clinicSelect = selectFieldTestkit(nightmare)("[name='clinic']");
    await clinicSelect.select('.select-clinic-option-0');

    await nightmare.mouseup('.create-follower-btn');

    const followerRowExists = followerName =>
        document
        .querySelector('.entity-table')
        .innerText
        .indexOf(followerName) !== -1;

    await nightmare.wait(followerRowExists, follower.name);

    return follower;
}
