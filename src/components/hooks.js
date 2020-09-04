import { useState } from "react";
import { useMediaQuery, useTheme } from "@material-ui/core";

export const useBelowBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.down(breakpoint));
export const useAboveBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.up(breakpoint));

export const useSeen = (viewed) => {
    const [seen, setSeen] = useState(false);
    if (viewed && !seen) setSeen(true);
    return seen;
};
