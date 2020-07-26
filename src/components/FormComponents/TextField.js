import React from 'react';
import { TextField } from '@material-ui/core';

export default function ({ input, label, meta: { touched, error }, ...custom }) {
  return (
    <TextField
      helperText={touched && error}
      error={touched && error}
      fullWidth={true}
      label={label}
      {...input}
      {...custom}
    />
  );
}
