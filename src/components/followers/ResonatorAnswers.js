import React from "react";
import { List, ListSubheader, ListItem, ListItemText } from "@material-ui/core";

import Bidi from "../Bidi";
import { getOptionLabel } from "./utils";

const getQuestionAnswer = (question) => question.options.find((option) => option.id === question.answer);

export default ({ resonator }) => (
    <List dense>
        <ListSubheader>Your Answers</ListSubheader>
        {resonator.questions.map((question) => (
            <ListItem key={question.id}>
                <ListItemText
                    primary={<Bidi fullWidth>{question.body}</Bidi>}
                    secondary={<Bidi fullWidth>{getOptionLabel(getQuestionAnswer(question), question)}</Bidi>}
                />
            </ListItem>
        ))}
    </List>
);
