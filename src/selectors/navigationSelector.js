import _ from "lodash";
import { createSelector } from "reselect";

export default createSelector(
    (state) => state.menu,
    (state) => state.navigation,

    (menu, navigation) => ({
        menuOpen: Boolean(menu.isOpen),
        title: navigation.title,
        modal: navigation.modal,
        modalProps: _.get(navigation.modal, "props"),
    })
);
