import React from 'react';
import { Button } from '@material-ui/core';

export default ({onClick, style}) => {
    return (
        <Button
            type='button'
            onClick={onClick}
            style={style}>
            Back
        </Button>
    );
};
