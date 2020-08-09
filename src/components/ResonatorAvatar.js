import React from "react";
import { Avatar } from "@material-ui/core";

export default ({ resonator, className = "" }) => <Avatar src={resonator.picture} variant="rounded" className={className} />;
