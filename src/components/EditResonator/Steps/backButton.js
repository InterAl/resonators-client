import React from "react";
import { Button } from "@material-ui/core";

export default ({ onClick, style, className = "", ...more }) => {
    return (
        <Button type="button" onClick={onClick} className={className} style={style} {...more}>
            Back
        </Button>
    );
};
