import { createSelector } from 'reselect';
import loginInfo from './loginInfo';

export default createSelector(
    state => loginInfo,

    loginInfo => ({
        showHamburger: Boolean(loginInfo.loggedIn)
    })
)
