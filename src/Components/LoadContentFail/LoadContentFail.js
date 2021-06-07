import React from "react";
import { MdSmsFailed  } from "react-icons/md";
const LoadContentFail = ({contentType, shape}) => (shape === "phrase" ? <h4 className="loading__error">Couldn't load {contentType}. Try again later.</h4> : <MdSmsFailed className="load__failed__ico" />)
export default LoadContentFail;