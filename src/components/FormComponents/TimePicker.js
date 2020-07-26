import React from 'react';
import { KeyboardTimePicker } from '@material-ui/pickers';

export default ({ input: { onChange, value }, ...custom }) => (
    <KeyboardTimePicker
        hintText="12hr Format"
        onChange={onChange}
        value={value}
        {...custom}
    />
)
