import React from 'react';
import { Checkbox } from '@material-ui/core';

export default ({ input: { onChange, value }, meta, ...custom }) => (
    <Checkbox
        checked={!!value}
        onChange={(ev, checked) => onChange(checked)}
        {...custom}
    />
)
