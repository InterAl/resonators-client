import React from "react";
import { KeyboardTimePicker } from "@material-ui/pickers";

export default ({ input: { onChange, value }, label, ...custom }) => (
    <KeyboardTimePicker
        autoOk={true}
        ampm={false}
        minutesStep={5}
        value={value}
        label={label}
        onChange={onChange}
        format="HH:mm"
        {...custom}
    />
);
