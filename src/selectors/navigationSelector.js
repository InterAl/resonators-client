import { createSelector } from 'reselect';
import loginInfoSelector from './loginInfo';

export default createSelector(
    loginInfoSelector,
    state => state.menu,

    (loginInfo, menu) => ({
        showHamburger: Boolean(loginInfo.loggedIn),
        menuOpen: Boolean(menu.isOpen)
    })
)
