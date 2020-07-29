import React from "react";
import { Switch, FormControlLabel } from "@material-ui/core";

export default ({ input: { onChange, value }, meta, label, ...custom }) => (
    <FormControlLabel
        control={
            <Switch
                color="primary"
                checked={value === "on"}
                onChange={() => onChange(value === "on" ? "off" : "on")}
                {...custom}
            />
        }
        label={label}
    />
);
