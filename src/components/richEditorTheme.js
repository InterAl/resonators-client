import { createMuiTheme } from '@material-ui/core/styles';


export const richEditorTheme = createMuiTheme();

Object.assign(richEditorTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                width: "100%",
                minWidth: "500px"
            },
            container: {
                margin: "-25px 0px 0px 0px"
            },
            editor: {
                borderBottom: "1px solid gray",
                minHeight:"40px",
                paddingBottom: "0"
            },
            toolbar: {
                borderBottom: "1px solid gray",
                marginLeft: "15px"
            },
            placeHolder: {
                position: "absolute",
                top: "50px",
            },
        }
    }
});
