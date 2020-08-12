import React from "react";
import { List, ListSubheader, ListItem, ListItemText } from "@material-ui/core";

import Direction from "../Direction";
import { getOptionLabel } from "./utils";

const getQuestionAnswer = (question) => question.options.find((option) => option.id === question.answer);

export default ({ resonator }) => (
    <List dense>
        <ListSubheader>Your Answers</ListSubheader>
        {resonator.questions.map((question) => (
            <Direction by={question.body} key={question.id}>
                <ListItem>
                    <ListItemText
                        primary={question.body}
                        secondary={getOptionLabel(getQuestionAnswer(question), question)}
                    />
                </ListItem>
            </Direction>
        ))}
    </List>
);
