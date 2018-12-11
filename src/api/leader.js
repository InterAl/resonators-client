import fetcher from './fetcher';

export function get() {
    return fetcher('/leader_followers/leaders');
}