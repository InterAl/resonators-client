import { createSelector } from 'reselect';
import loginInfoSelector from './loginInfo';

export default createSelector(
    loginInfoSelector,
    state => state.menu,
    state => state.navigation,

    (loginInfo, menu, navigation) => ({
        showHamburger: Boolean(loginInfo.loggedIn),
        menuOpen: Boolean(menu.isOpen),
        title: navigation.title,
        modal: navigation.modal,
        modalProps: _.get(navigation.modal, 'props')
    })
)
