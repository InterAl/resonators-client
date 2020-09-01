/********** Fetch Interception **********/

self.addEventListener("fetch", (event) => {
    console.log(`Fetch for ${event.url}`);
});

/********** Push Notifications **********/

self.addEventListener("push", (event) => {
    const { type, title, options } = event.data.json();
    event.waitUntil(self.registration.showNotification(title, getNotificationOptions(type, options)));
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(notificationActions[event.notification.data.type](event));
});

self.addEventListener("pushsubscriptionchange", (event) => {
    event.waitUntil(replaceSubscription(event));
});

/**
 * Computes the options for a new notification.
 *
 * @param {String} type - the notification type
 * @param {Object} options - options passed by the notification sender
 */
function getNotificationOptions(type, options) {
    const typeOptions = notificationFormatters[type](options);
    return {
        ...typeOptions,
        icon: "https://www.psysession.com/icon.png",
        data: {
            ...typeOptions.data,
            type,
        },
    };
}

/**
 * Update the server with a new subscription after the old one has been replaced
 * by the browser or push service.
 *
 * @param {ExtendableEvent} - a 'pushsubscriptionchange' event triggered in the service worker
 */
function replaceSubscription({ oldSubscription, newSubscription }) {
    fetch("/api/push-subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldSubscription, newSubscription }),
    });
}

// a map of functions to compute notification options for each notification type
const notificationFormatters = {
    resonator: ({ id, image, body }) => ({ body, image, tag: id }),
};

// a map of functions to handle notification clicks for each notification type
const notificationActions = {
    resonator: (event) => clients.openWindow(`/follower/resonators/${event.notification.tag}`),
};
