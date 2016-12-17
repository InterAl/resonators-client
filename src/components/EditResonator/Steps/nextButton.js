import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

export default ({style, onClick}) => {
    let onClickProp = onClick ? {onClick} : {};

    return (
        <RaisedButton
            type={onClick ? 'button' : 'submit'}
            label='Next'
            primary={true}
            style={style}
            {...onClickProp}
        />
    );
};
