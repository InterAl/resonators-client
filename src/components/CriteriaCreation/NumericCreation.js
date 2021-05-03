import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { Typography, List, ListItem, InputAdornment, ListSubheader, withTheme } from "@material-ui/core";
import TextBox from "../FormComponents/TextBox";

class NumericCreation extends Component {
    static propTypes = {
        formValues: PropTypes.object,
    };

    renderList(min, max) {
        if (typeof min === "undefined" || max <= 0) return false;
        return (
            <List
                subheader={
                    <ListSubheader style={{ backgroundColor: this.props.theme.palette.background.paper }}>
                        Configure labels (optional)
                    </ListSubheader>
                }
                style={{ overflow: "auto", maxHeight: "40vh" }}
            >
                {min < max &&
                    _.range(min, max + 1).map((value) => (
                        <ListItem key={value}>
                            <TextBox
                                name={`answers.num${value}`}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Typography variant="body2" color="textSecondary">
                                                {value}
                                            </Typography>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </ListItem>
                    ))}
            </List>
        );
    }

    render() {
        const {
            formValues: { numMin, numMax },
        } = this.props;

        return (
            <div>
                <Typography variant="subtitle2">Define a Scale</Typography>
                <div style={{ display: "flex" }}>
                    <TextBox
                        name="numMin"
                        type="number"
                        label="Minimum"
                        style={{ marginRight: 16 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextBox
                        name="numMax"
                        type="number"
                        label="Maximum"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </div>
                {this.renderList(parseInt(numMin), parseInt(numMax))}
            </div>
        );
    }
}

export default withTheme(NumericCreation);
