import { createSelector } from 'reselect';
import loginInfoSelector from './loginInfo';

export default createSelector(
    loginInfoSelector,

    loginInfo => ({
        showHamburger: Boolean(loginInfo.loggedIn)
    })
)
