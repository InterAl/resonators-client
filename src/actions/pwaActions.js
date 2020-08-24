import { ActionCreatorHelper } from "../saga-reducers-factory-patch";

const actionsList = ["REGISTER_INSTALL_PROMPT", "APP_INSTALLED"];

export const types = ActionCreatorHelper.createTypes(actionsList);
export const actions = ActionCreatorHelper.createActions(actionsList);
