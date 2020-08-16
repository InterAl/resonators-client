import moment from "moment";

export const formatResonatorTime = (time) => moment(time).format("dddd, MMMM Do YYYY, HH:mm");

export const getOptionLabel = (option, question) =>
    question.type === "numeric" ? `${option.value}${option.label ? ` - ${option.label}` : ""}` : option.label;
