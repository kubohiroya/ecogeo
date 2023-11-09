import styled from "@emotion/styled";
import React, { ReactElement, useState } from "react";
import GraphButtons from "./GraphButtons/GraphButtons";
import { hasFeatureDetectingHoverEvent } from "../../util/browserUtil";

/* eslint-disable-next-line */
export interface GraphPanelProps {
  hideGraphEditButtons: boolean;
  disableGraphEditButtons: boolean;
  children?: ReactElement | string;
}

const StyledGraphPanel = styled.div`
  width: calc(100% - 4px);
  height: calc(100% - 4px);
  flex-grow: 1;
  display: flex;

  justify-content: start;
  align-items: start;
  align-content: start;
  position: relative;
  margin: 0;
  border: 0;
  border-radius: 8px;
  background-color: aquamarine;
`;

export function GraphPanel(props: GraphPanelProps) {
  const [hover, setHover] = useState(false);
  return (
    <StyledGraphPanel
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <GraphButtons
        show={hover || !hasFeatureDetectingHoverEvent()}
        disabled={props.disableGraphEditButtons}
      />
      {props.children}
    </StyledGraphPanel>
  );
}

export default GraphPanel;
