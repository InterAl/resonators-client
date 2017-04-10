import Nightmare from 'nightmare';
import path from 'path';

let nightmare;

export function initNightmare(endpoint) {
    nightmare = Nightmare({
        typeInterval: 20
    });

    patchGoto(nightmare, endpoint);
    patchScreenshot(nightmare);
};

function patchGoto(nightmare, endpoint) {
    const baseUrl = `http://${endpoint}`;
    const oldGoto = nightmare.goto;
    nightmare.goto = (url, ...rest) => {
        return oldGoto.call(nightmare, baseUrl + url, ...rest);
    };
}

function patchScreenshot(nightmare) {
    const screenshotDir = path.join(__dirname, '/screenshots');
    const oldScreenshot = nightmare.screenshot;
    nightmare.screenshot = (filename, ...rest) => {
        return oldScreenshot.call(nightmare,
                                  path.join(screenshotDir, filename),
                                  ...rest);
    };
}

export default () => nightmare;
