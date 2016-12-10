import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default ({style}) => {
    return (
        <RaisedButton
            type='submit'
            label='Next'
            primary={true}
            style={style}
        />
    );
};
