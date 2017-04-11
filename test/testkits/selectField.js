export default nightmare => wrapperSelector => {
    return {
        select(optionSelector) {
            return nightmare.mouseup(`${wrapperSelector} button`)
                            .mouseup(optionSelector);
        }
    };
};
