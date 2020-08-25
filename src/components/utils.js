import _ from 'lodash';
import { isWidthDown } from '@material-ui/core/withWidth';


export function getResonatorDirection(resonator) {
    const text = (resonator.content + resonator.description) || '';
    return getDir(text);
}

export function isMobile(width) {
    return isWidthDown('xs', width);
}

function getDir(text) {
    const textArr = text.split('');
    const hebrewLettersCount = _.reduce(textArr, (acc, letter) => {
        return acc + (isHebrewLetter(letter) ? 1 : 0);
    }, 0);

    const isHebrew = hebrewLettersCount / textArr.length > 0.5;
    return isHebrew ? 'rtl' : 'ltr';
}

function isHebrewLetter(letter) {
    const code = letter.charCodeAt(0);
    return code === 32 || code >= 1488 && code <= 1514;
}
