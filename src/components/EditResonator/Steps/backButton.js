import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default ({onTouchTap, style}) => {
    return (
        <RaisedButton
            type='button'
            label='Back'
            primary={false}
            onTouchTap={onTouchTap}
            style={style}
        />
    );
};
