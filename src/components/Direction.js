import _ from "lodash";
import React from "react";

export default ({ by, children, ...props }) => {
    const rtl = isRtl(by);
    const dir = rtl ? "rtl" : "ltr";
    const textAlign = rtl ? "right" : "left";

    return React.Children.map(children, (child) =>
        child
            ? React.cloneElement(child, {
                  ...props,
                  dir,
                  style: {
                      ..._.get(child, "props.style", {}),
                      textAlign,
                  },
              })
            : null
    );
};

const isRtl = (text) => {
    const letters = text.replace(/\s/g, "").split("");
    const hebrewLetters = letters.filter(isHebrewLetter);

    return hebrewLetters.length / letters.length > 0.5;
};

const isHebrewLetter = (letter) => {
    const code = letter.charCodeAt(0);
    return code >= 1488 && code <= 1514;
};
