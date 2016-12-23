import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default ({style, onTouchTap}) => {
    let onClickProp = onTouchTap ? {onTouchTap} : {};

    return (
        <RaisedButton
            type={onTouchTap ? 'button' : 'submit'}
            label='Next'
            primary={true}
            style={style}
            {...onClickProp}
        />
    );
};
