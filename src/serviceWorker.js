self.addEventListener("fetch", (event) => {
    console.log(`Fetch for ${event.url}`);
});

self.addEventListener("push", (event) => {
    const { title, body } = event.data.json();
    self.registration.showNotification(title, {
        body,
        icon: "https://www.psysession.com/icon.png",
    });
});
