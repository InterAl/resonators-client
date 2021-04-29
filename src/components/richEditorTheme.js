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
                margin: "8px 0px 40px 0px"
            },
            editor: {
                borderTop: "1px solid gray",
                borderBottom: "1px solid gray",
            },
            placeHolder: {
                position: "absolute",
                top: "50px",
                borderBottom: "1px solid gray"
            },
        }
    }
});
