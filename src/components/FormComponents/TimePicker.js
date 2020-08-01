import React from "react";
import { Tooltip } from "@material-ui/core";
import { Schedule } from "@material-ui/icons";
import { KeyboardTimePicker } from "@material-ui/pickers";

export default ({ input: { onChange, onFocus, onBlur, value }, meta: { error, touched }, ...rest }) => (
    <KeyboardTimePicker
        ampm={false}
        autoOk={true}
        format="HH:mm"
        minutesStep={5}
        onBlur={() => onBlur(value)}
        onFocus={onFocus}
        onChange={onChange}
        value={value || null}
        helperText={touched && error}
        error={Boolean(touched && error)}
        keyboardIcon={
            <Tooltip title="Open picker">
                <Schedule />
            </Tooltip>
        }
        {...rest}
    />
);
