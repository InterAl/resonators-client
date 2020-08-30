self.addEventListener("fetch", (event) => {
    console.log(`Fetch for ${event.url}`);
});

self.addEventListener("push", (event) => {
    const { type, title, options } = event.data.json();
    const notificationOptions = notificationFormatters[type](options);

    event.waitUntil(
        self.registration.showNotification(title, {
            ...notificationOptions,
            icon: "https://www.psysession.com/icon.png",
            data: {
                ...notificationOptions.data,
                type,
            },
        })
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(notificationActions[event.notification.data.type](event));
});

self.addEventListener("pushsubscriptionchange", (event) => {
    event.waitUntil(
        fetch("/api/push-subscription", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                oldSubscription: event.oldSubscription,
                newSubscription: event.newSubscription,
            }),
        })
    );
});

const notificationFormatters = {
    resonator: ({ id, image, body }) => ({
        body,
        image,
        tag: id,
    }),
};

const notificationActions = {
    resonator: (event) => clients.openWindow(`/follower/resonators/${event.notification.tag}`),
};
