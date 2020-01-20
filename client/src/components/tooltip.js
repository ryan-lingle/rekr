import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const MyTooltip = (props) => {
  return(
    <OverlayTrigger
      placement={props.placement || 'top'}
      overlay={
        <Tooltip id={`tooltip-${props.placement || 'top'}`}>
          {props.tooltip}
        </Tooltip>
      }
    >
      {props.children}
    </OverlayTrigger>
  )
}

export default MyTooltip;
