import { useState } from "react";
import { useSnackbar } from "notistack";
import { useMediaQuery, useTheme, Grow } from "@material-ui/core";

export const useBelowBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.down(breakpoint));
export const useAboveBreakpoint = (breakpoint) => useMediaQuery(useTheme().breakpoints.up(breakpoint));

export const useConfirmationSnackbar = () => {
    const { enqueueSnackbar } = useSnackbar();
    return (message) =>
        enqueueSnackbar(message, {
            autoHideDuration: 2000,
            TransitionComponent: Grow,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "right",
            },
        });
};
export const useErrorSnackbar = () => {
    const { enqueueSnackbar } = useSnackbar();
    return (error) =>
        enqueueSnackbar(error, {
            variant: "error",
            autoHideDuration: 6000,
            TransitionComponent: Grow,
            anchorOrigin: {
                vertical: "bottom",
                horizontal: "center",
            },
        });
};

export const useLoading = () => {
    const [loading, setLoading] = useState(false);

    const load = (promise) => {
        setLoading(true);
        promise.finally(() => setLoading(false));
    };

    return [loading, load];
};
