import React from 'react';
import { Switch } from '@material-ui/core';

export default ({input: {onChange, value}, meta, ...custom}) => (
    <Switch
        checked={value === 'on'}
        onChange={() => onChange(value === 'on' ? 'off' : 'on')}
        {...custom}
    />
)
