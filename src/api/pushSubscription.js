import api from "./fetcher";

const BASE_URL = "/push-subscription";

export function saveSubsctiption(subscription) {
    return api.post(BASE_URL, subscription);
}

export function replaceSubscription(oldSubscription, newSubscription) {
    return api.put(`${BASE_URL}/${oldSubscription.endpoint}`, newSubscription);
}

export function deleteSubscription(subscription) {
    return api.delete(`${BASE_URL}/${subscription.endpoint}`);
}
