import { createMuiTheme } from "@material-ui/core";
import { cyan } from "@material-ui/core/colors";

export default createMuiTheme({
    palette: {
        primary: {
            main: cyan[500],
        },
        contrastThreshold: 2,
    },
});
