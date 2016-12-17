import React from 'react';
import Toggle from 'material-ui/Toggle';

export default ({input: {onChange, value}, meta, ...custom}) => (
    <Toggle
        toggled={value === 'on'}
        onToggle={() => onChange(value === 'on' ? 'off' : 'on')}
        {...custom}
    />
)
