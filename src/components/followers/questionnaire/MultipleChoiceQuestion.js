import React from "react";
import { RadioGroup, Radio, FormControlLabel } from "@material-ui/core";

function getOptionLabel(option) {
    return option.label ? `${option.value} - ${option.label}` : option.value;
}

export default function MultipleChoiceQuestion({ question, options, chosen, handleAnswer }) {
    return (
        <RadioGroup value={chosen} onChange={(event) => handleAnswer(event.target.value)}>
            {options.map((option) => (
                <FormControlLabel
                    key={option.id}
                    value={option.id}
                    control={<Radio color="primary" />}
                    label={getOptionLabel(option)}
                />
            ))}
        </RadioGroup>
    );
}
