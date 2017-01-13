import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

export default props => {
    return (
        <Dialog
            open={props.open}
            actions={[
                <FlatButton
                    onTouchTap={props.onClose}
                    label="OK"
                    primary={true}
                />
            ]}
            title='Password Recovery'
            modal={false}
            onRequestClose={props.onClose}
        >
            A link for resetting your password was sent to your mail.
        </Dialog>
    );
};
