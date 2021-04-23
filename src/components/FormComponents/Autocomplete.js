import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import {Autocomplete} from "@material-ui/lab";

export default function AutocompleteField({options, labelKey, input, ...custom}) {
    // state for Autocomplete dropdown
    const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);

    return (
        <Autocomplete
            freeSolo
            style={{
                minWidth: "320px"
            }}
            options={options}
            className="autocomplete_field"
            getOptionLabel={option => option[labelKey] || ""}
            open={autoCompleteOpen}
            onChange={_.debounce((event,value) => {
                input.onChange(value ? value[labelKey] : "")
            }, 200)}
            // This will close the autocomplete on empty text
            // Will collapse on select
            onInputChange={(event, value, reason) => {
                switch(reason) {
                    case 'input':
                        setAutoCompleteOpen(!!value);
                        break;
                    case 'reset':
                    case 'clear':
                        setAutoCompleteOpen(false);
                        break;
                    default:
                        console.log(reason);
                };
            }}
            renderInput={params => (
                <TextField
                    {...params}
                    {...input}
                    {...custom}
                    inputProps={{
                        ...params.inputProps,
                        name: input.name,
                        value: input.value,
                        autoComplete: 'new-password', //disable browser autocomplete that overlaps the component and ruins UX
                        onBlur: () => setAutoCompleteOpen(false)
                    }}
                />
            )}
        />
    );
}

