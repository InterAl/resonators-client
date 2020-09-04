import _ from "lodash";
import React from "react";
import jssRtlPlugin from "jss-rtl";
import { create as createJssInstance } from "jss";
import { ThemeProvider, StylesProvider, jssPreset } from "@material-ui/core";

const rtlJss = createJssInstance({
    plugins: [...jssPreset().plugins, jssRtlPlugin()],
});

export default function Direction({ by, children, ...props }) {
    const rtl = isRtl(by);
    const dir = rtl ? "rtl" : "ltr";

    const transformedChildren = React.Children.map(children, (child) =>
        child ? React.cloneElement(child, { ...props, dir }) : null
    );

    return rtl ? (
        <ThemeProvider theme={(outerTheme) => ({ ...outerTheme, direction: "rtl" })}>
            <StylesProvider jss={rtlJss}>{transformedChildren}</StylesProvider>
        </ThemeProvider>
    ) : (
        transformedChildren
    );
}

const isRtl = (text) => {
    const letters = text.replace(/\s/g, "").split("");
    const hebrewLetters = letters.filter(isHebrewLetter);

    return hebrewLetters.length / letters.length > 0.5;
};

const isHebrewLetter = (letter) => {
    const code = letter.charCodeAt(0);
    return code >= 1488 && code <= 1514;
};
