import React from 'react';
import TimePicker from 'material-ui/TimePicker';

export default ({input: {onChange, value}, ...custom}) => (
    <TimePicker
        hintText="12hr Format"
        onChange={onChange}
        value={value}
        {...custom}
    />
)
