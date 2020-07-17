self.addEventListener("fetch", event => {
    console.log(`Fetch for ${event.url}`)
})