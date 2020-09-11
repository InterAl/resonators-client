import React from "react";
import { Button } from "@material-ui/core";

export default function NavigationControls({ index, setIndex, total, nextDisabled = false, ...extra }) {
    const stepBack = () => setIndex(index - 1);
    const stepNext = () => setIndex(index + 1);

    return (
        <div {...extra}>
            <Button onClick={stepBack} disabled={index === 0}>
                Back
            </Button>
            <Button color="primary" onClick={stepNext} disabled={index === total - 1 || nextDisabled}>
                Next
            </Button>
        </div>
    );
}
