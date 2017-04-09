import Nightmare from 'nightmare';

let nightmare;

export function initNightmare(endpoint) {
    nightmare = Nightmare();

    const oldGoto = nightmare.goto;
    const baseUrl = `http://${endpoint}`;

    nightmare.goto = (url, ...rest) => {
        return oldGoto.call(nightmare, baseUrl + url, ...rest);
    };
};

export default () => nightmare;
