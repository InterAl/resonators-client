import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';


export default props => {
    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Password Recovery</DialogTitle>
            <DialogContent>A link for resetting your password was sent to your mail.</DialogContent>
            <DialogActions>
                <Button color="primary" onClick={props.onClose}>OK</Button>
            </DialogActions>
        </Dialog>
    );
};
