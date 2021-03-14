import React from "react";

const MenuOption = (props) => (
<li onClick={props.onClick} className={props.className} >{props.el}</li>
)

export default MenuOption;