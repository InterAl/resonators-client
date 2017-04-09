import _ from 'lodash';
import { createSelector } from 'reselect';
import loginInfoSelector from './loginInfo';
import isMobile from '../components/isMobile';

export default createSelector(
    loginInfoSelector,
    state => state.menu,
    state => state.navigation,

    (loginInfo, menu, navigation) => ({
        showHamburger: isMobile() && Boolean(loginInfo.loggedIn),
        menuOpen: loginInfo.loggedIn && (!isMobile() || Boolean(menu.isOpen)),
        title: navigation.title,
        modal: navigation.modal,
        modalProps: _.get(navigation.modal, 'props')
    })
)
