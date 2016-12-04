import React from 'react';
import TextField from 'material-ui/TextField';

export default function({ input, label, meta: { touched, error }, ...custom }) {
    return (
        <TextField hintText={label}
          fullWidth={true}
          floatingLabelText={label}
          errorText={touched && error}
          {...input}
          {...custom}
        />
    );
}
