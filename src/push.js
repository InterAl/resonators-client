import * as api from "./api/pushSubscription";
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
            .then(api.saveSubsctiption)
            .catch(console.error);
    }
}
