import React from 'react';
import SelectField from 'material-ui/SelectField';

export default function({ input, label, meta: { touched, error }, children, ...custom }){
    return (
        <SelectField
            floatingLabelText={label}
            errorText={touched && error}
            {...input}
            onChange={(event, index, value) => input.onChange(value)}
            children={children}
            {...custom}/>
    );
}
