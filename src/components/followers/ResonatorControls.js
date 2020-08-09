import React from "react";
import { Button } from "@material-ui/core";

export default ({ activeQuestion, setActiveQuestion, editMode, setEditMode, resonator }) => {
    const stepBack = () => setActiveQuestion((prevActiveQuestion) => prevActiveQuestion - 1);
    const stepNext = () => setActiveQuestion((prevActiveQuestion) => prevActiveQuestion + 1);

    return editMode ? (
        <>
            <Button onClick={stepBack} disabled={activeQuestion === 0}>
                Back
            </Button>
            <Button color="primary" onClick={stepNext} disabled={activeQuestion === resonator.questions.length - 1}>
                Next
            </Button>
            <Button variant="contained" color="primary" onClick={() => setEditMode(false)} disabled={!resonator.done}>
                Finish
            </Button>
        </>
    ) : (
        <Button color="primary" onClick={() => setEditMode(true)}>
            Edit
        </Button>
    );
};
