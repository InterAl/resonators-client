import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default ({onClick, style}) => {
    return (
        <RaisedButton
            type='button'
            label='Back'
            primary={false}
            onClick={onClick}
            style={[{marginRight: 8}, style]}
        />
    );
};
