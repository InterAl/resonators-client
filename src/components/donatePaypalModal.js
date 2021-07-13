import React, { Component } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import {PayPalButton} from "react-paypal-button-v2";

class donatePaypalModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 5
        };
        this.paypalClientId = "AehU2y9cvzNuEsPDy4yJ9m7WLSyKWkwC_3Rhdyepx8uzoA37E7ApsDbR-LVt0UenARds4ucNtgYKUN04";
    }

    render() {
        return (
            <Dialog open={this.props.open} onClose={this.props.onClose}>
                <DialogTitle>Donate</DialogTitle>
                <DialogContent>
                    <label for="donateAmount" style={{ display:"block", marginBottom: "20px" }}>Amount:
                        $<input
                            type="number"
                            defaultValue={this.state.amount}
                            onChange={(e) => this.setState({ amount: e.target.value})}
                            min={5}
                        />
                    </label>
                    <PayPalButton
                        amount={this.state.amount}
                        shippingPreference="NO_SHIPPING"
                        onSuccess={(details, data) => {
                            alert("Much appreciated!");
                        }}
                        options={{
                            clientId: this.paypalClientId
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onClose}>Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default donatePaypalModal;
