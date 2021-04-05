import fetcher from './fetcher';

export function get() {
    return fetcher('/getUserGooglePhotos');
}

export function getSystem() {
    return fetcher('/getSystemGooglePhotos');
}
