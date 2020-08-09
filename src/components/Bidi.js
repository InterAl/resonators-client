import React from "react";

export default (props) => {
    const rtl = isRtl(props.children);

    return (
        <span
            dir={rtl ? "rtl" : "ltr"}
            style={{
                display: props.fullWidth ? "block" : "inline",
                textAlign: rtl ? "right" : "left",
            }}
        >
            {props.children}
        </span>
    );
};

const isRtl = (text) => {
    const letters = text.split("");
    const hebrewLetters = letters.filter(isHebrewLetter);

    return hebrewLetters.length / letters.length > 0.5;
};

const isHebrewLetter = (letter) => {
    const code = letter.charCodeAt(0);
    return code === 32 || (code >= 1488 && code <= 1514);
};
