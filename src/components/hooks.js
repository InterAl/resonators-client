import { useMediaQuery, useTheme } from "@material-ui/core";

export const useBelowBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.down(breakpoint));
export const useAboveBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.up(breakpoint));
