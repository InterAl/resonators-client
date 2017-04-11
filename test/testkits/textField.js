export default nightmare => wrapperSelector => {
    return {
        clearInput() {
            return nightmare.evaluate(selector => {
                document.querySelector(selector).focus();
            }, wrapperSelector);
        }
    };
};
