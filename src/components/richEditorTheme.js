import { createMuiTheme } from '@material-ui/core/styles';


export const richEditorTheme = createMuiTheme();

Object.assign(richEditorTheme, {
    overrides: {
        MUIRichTextEditor: {
            root: {
                width: "100%",
                minWidth: "500px"
            },
            editor: {
                borderBottom: "1px solid gray"
            },
            placeHolder: {
                position: "absolute",
                top: "-30px"
            },
        }
    }
});
