import React from 'react';
import Toggle from 'material-ui/Toggle';

export default ({input: {onChange, value}, ...custom}) => (
    <Toggle
        toggled={value}
        onToggle={() => onChange(!value)}
        {...custom}
    />
)
