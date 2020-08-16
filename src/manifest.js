const path = require("path");

module.exports = {
    name: "Resonators",
    description: "An application for resonating bio-feedback messages to patients, and provide continuous measurement",
    categories: ["health", "medical"],
    display: "standalone",
    start_url: "/login",
    scope: "/",
    theme_color: "#00a0b4",
    icons: [
        {
            src: path.resolve("./src/images/icons/resonators.png"),
            sizes: [144, 192, 512],
        },
    ],
};
