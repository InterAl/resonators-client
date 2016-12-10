import React from 'react';
import Checkbox from 'material-ui/Checkbox';

export default ({input: {onChange, value}, ...custom}) => (
    <Checkbox
        checked={value}
        onCheck={() => onChange(!value)}
        {...custom}
    />
)
