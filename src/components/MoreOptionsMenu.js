import React, { useState } from "react";
import { IconButton, Menu } from "@material-ui/core";
import { MoreVert, MoreHoriz } from "@material-ui/icons";

export default ({ horizontal = false, keepOpen = false, children = [], ...rest }) => {
    const [menuAnchor, setMenuAnchor] = useState(null);

    const openMenu = (event) => setMenuAnchor(event.currentTarget);
    const closeMenu = () => setMenuAnchor(null);

    const overflowIcon = horizontal ? <MoreHoriz /> : <MoreVert />;

    return (
        <span>
            <IconButton onClick={openMenu}>{overflowIcon}</IconButton>
            <Menu
                keepMounted
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={closeMenu}
                onClick={keepOpen ? null : closeMenu}
                {...rest}
            >
                {children}
            </Menu>
        </span>
    );
};
