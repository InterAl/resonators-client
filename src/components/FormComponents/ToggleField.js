import React from "react";
import { FormControlLabel, Checkbox } from "@material-ui/core";

export default ({ input: { onChange, value }, meta, label, ...custom }) => (
    <FormControlLabel
        control={
            <Checkbox
                color="primary"
                checked={value === "on"}
                onChange={() => onChange(value === "on" ? "off" : "on")}
                {...custom}
            />
        }
        label={label}
    />
);
