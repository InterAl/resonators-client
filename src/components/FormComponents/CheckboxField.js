import React from 'react';
import Checkbox from 'material-ui/Checkbox';

export default ({input: {onChange, value}, meta, ...custom}) => (
    <Checkbox
        checked={!!value}
        onCheck={(ev, checked) => onChange(checked)}
        {...custom}
    />
)
