import React, { memo } from "react";

const MenuOption = (props) => (
<li onClick={props.onClick} className={props.className} >{props.el}</li>
)

export default memo(MenuOption);