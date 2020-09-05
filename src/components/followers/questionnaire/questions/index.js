import React from "react";

import BooleanQuestion from "./BooleanQuestion";
import MultipleChoiceQuestion from "./MultipleChoiceQuestion";

function renderQuestion(question, handler) {
    switch (question.type) {
        case "numeric":
            return (
                <MultipleChoiceQuestion
                    question={question.body}
                    options={question.options}
                    chosen={question.answer}
                    handleAnswer={handler}
                />
            );
        case "boolean":
            return (
                <BooleanQuestion
                    question={question.body}
                    yes={question.options[0]}
                    no={question.options[1]}
                    chosen={question.answer}
                    handleAnswer={handler}
                />
            );
        default:
            return null;
    }
}

function Question({ question, onAnswer }) {
    return renderQuestion(question, onAnswer);
}

export { BooleanQuestion, MultipleChoiceQuestion };
export default Question;
