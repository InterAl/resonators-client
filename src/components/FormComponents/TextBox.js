import React from 'react';
import TextField from './TextField';
import {Field} from 'redux-form';

export default props => {
    return <Field component={TextField} {...props} />;
};
