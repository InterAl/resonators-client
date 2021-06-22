import moment from "moment";

export const formatResonatorTime = (time) => moment(time).format("dddd, MMMM Do YYYY, HH:mm");

export const getOptionLabel = (option, question) => {
    if (question.type === "numeric") {
        return `${option.value}${option.label ? ` - ${option.label}` : ""}`
    } else if (question.type === "text") {
        return "Text";
    } else {
        return option.label;
    }
}
