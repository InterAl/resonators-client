import Nightmare from 'nightmare';

let nightmare;

export function initNightmare(endpoint) {
    nightmare = Nightmare();

    const oldGoto = nightmare.goto;
    const baseUrl = `http://${endpoint}`;

    nightmare.goto = (url, ...rest) => {
        console.log('nnnnnnnn', baseUrl+url);
        return oldGoto.call(nightmare, baseUrl + url, ...rest);
    };
};

export default () => nightmare;
