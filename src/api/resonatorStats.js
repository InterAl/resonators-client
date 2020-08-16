import fetcher from './fetcher';

export function get(resonatorId) {
    return fetcher(`/criteria/stats/reminders/${resonatorId}.json?download=false`);
}

export function getJsonFile(resonatorId) {
    return fetcher.download(`/criteria/stats/reminders/${resonatorId}.json?download=true`);
}
