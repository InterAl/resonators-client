import { useState } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";

export const useBelowBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.down(breakpoint));
export const useAboveBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.up(breakpoint));

export const useStateWithHistory = (initialState) => {
    const [state, setState] = useState([initialState]);

    const currentState = state[state.length - 1];
    const addState = (newState) => setState([...state, newState]);

    return [currentState, addState, state];
};
