import React from "react";
import {FormControlLabel, Radio, RadioGroup} from "@material-ui/core";

export default ({ isAdmin, isSystem, toggleSystem }) => {
    if (!isAdmin) return false;
    return (
        <RadioGroup
            style={{ justifyContent: 'center' }}
            row
            name="is_system"
            value={isSystem}
            onChange={toggleSystem}
        >
            <FormControlLabel value={false} control={<Radio color="primary" />} label="Regular" />
            <FormControlLabel value={true} control={<Radio color="primary" />} label="System" />
        </RadioGroup>
    );
};
