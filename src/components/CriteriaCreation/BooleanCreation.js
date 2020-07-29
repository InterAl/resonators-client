import React from "react";
import { Typography } from "@material-ui/core";
import TextBox from "../FormComponents/TextBox";


export default function BooleanCreation() {
    return (
        <div>
            <Typography variant="subtitle2">Select Labels</Typography>
            <div style={{ display: "flex" }}>
                <TextBox name="answers.true" label="Yes" style={{ marginRight: 16 }} />
                <TextBox name="answers.false" label="No" />
            </div>
        </div>
    );
}
