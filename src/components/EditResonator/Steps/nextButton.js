import React from 'react';
import { Button } from '@material-ui/core';

export default ({style, onClick}) => {
    let onClickProp = onClick ? {onClick} : {};

    return (
        <Button
            type={onClick ? 'button' : 'submit'}
            color="primary"
            style={style}
            {...onClickProp}>
            Next
        </Button>
    );
};