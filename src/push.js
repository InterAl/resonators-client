import api from "./api/fetcher";
import { pushServerKey } from "./config/push";

export function subscribeToPushNotifications() {
    return navigator.serviceWorker.ready
        .then((registration) =>
            registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: pushServerKey,
            })
        )
        .then((subscription) => api.post("/push-subscribe", subscription))
        .catch(console.error);
}
