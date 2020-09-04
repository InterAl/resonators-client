import React from "react";
import { RadioGroup, Radio, FormControlLabel } from "@material-ui/core";

export default function BooleanQuestion({ question, yes, no, chosen, handleAnswer }) {
    return (
        <RadioGroup value={chosen} onChange={(event) => handleAnswer(event.target.value)}>
            <FormControlLabel key={yes.id} value={yes.id} control={<Radio color="primary" />} label={yes.label} />
            <FormControlLabel key={no.id} value={no.id} control={<Radio color="primary" />} label={no.label} />
        </RadioGroup>
    );
}
