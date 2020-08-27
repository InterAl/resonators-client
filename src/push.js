import api from "./api/fetcher";
import { pushServerKey } from "./config/push";

export async function subscribeToPushNotifications() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (!subscription) {
        registration.pushManager
            .subscribe({
                userVisibleOnly: true,
                applicationServerKey: pushServerKey,
            })
            .then(saveSubsctiption)
            .catch(console.error);
    }
}

function saveSubsctiption(subscription) {
    return api.post("/push-subscribe", subscription);
}
