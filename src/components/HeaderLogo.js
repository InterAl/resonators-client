import React from "react";
import isMobile from "./isMobile";
import { Typography } from "@material-ui/core";

export default function HeaderLogo() {
    return (
        <Typography
            variant="h6"
            style={{
                color: "rgb(175, 245, 255)",
                textShadow: "2px 1px rgba(0, 0, 0, 0.24)",
                display: isMobile() ? "none" : "block",
            }}
        >
            Resonators
        </Typography>
    );
}
