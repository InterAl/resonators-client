import fetcher from './fetcher';

export function get() {
    return fetcher('/getUserGoogleContacts');
}
