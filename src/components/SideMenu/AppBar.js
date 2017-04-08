import React from 'react';
import AppBar from 'material-ui/AppBar';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';

export default function _AppBar(props) {
    return (
        <div>
            <AppBar
                iconElementLeft={
                    <IconButton onTouchTap={props.onClose}>
                        <CloseIcon/>
                    </IconButton>
                }
            />
        </div>
    );
}
