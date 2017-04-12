import Nightmare from 'nightmare';
import path from 'path';

let endpoint = 'localhost:45033';

export default function() {
    const nightmare = Nightmare({
        typeInterval: 1,
        show: false
    });

    patchGoto(nightmare, endpoint);
    patchScreenshot(nightmare);
    return nightmare;
}

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
