import React from 'react';
import { Select, InputLabel, FormControl, FormHelperText } from '@material-ui/core';

export default function({ input, label, meta: { touched, error }, children, ...custom }){
    return (
        <FormControl error={touched && error}>
            <Select
                label={<InputLabel>{label}</InputLabel>}
                {...input}
                onChange={(event, index, value) => input.onChange(value)}
                children={children}
                {...custom}/>
            <FormHelperText>{error}</FormHelperText>
        </FormControl>
    );
}
