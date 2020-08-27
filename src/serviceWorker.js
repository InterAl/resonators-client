self.addEventListener("fetch", (event) => {
    console.log(`Fetch for ${event.url}`);
});

self.addEventListener("push", (event) => {
    const { type, title, body, options } = event.data.json();

    self.registration.showNotification(title, {
        body,
        icon: "https://www.psysession.com/icon.png",
        ...notificationFormatters[type](options),
    });
});

const notificationFormatters = {
    resonator: (options) => ({
        image: options.image,
    }),
};
