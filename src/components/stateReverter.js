export default component => {
    let lastState = component.state;
    let dirty = false;

    return {
        setState(nextState) {
            if (!dirty) {
                lastState = component.state;
                dirty = true;
            }

            component.setState(nextState);
        },

        revertState() {
            component.setState(lastState);
            dirty = false;
            lastState = null;
        },

        commitState() {
            dirty = false;
            lastState = null;
        },

        isDirty() {
            return dirty;
        }
    };
}
