import fetcher from './fetcher';

export function get(resonatorId) {
    return fetcher(`/criteria/stats/reminders/${resonatorId}.json`);
}
