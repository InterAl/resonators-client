import fetcher from './fetcher';

export function get(resonatorId) {
    return fetcher(`/criteria/stats/reminders/${resonatorId}.json`);
}

export function getJsonFile(resonatorId) {
    return fetcher.download(`/criteria/stats/reminders/${resonatorId}.json?download=true`);
}
