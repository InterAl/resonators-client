import React from 'react';
import { AppBar, IconButton, Toolbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';


export default function _AppBar(props) {
    return (
        <div>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" onClick={props.onClose}>
                        <Close />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </div>
    );
}
