import styled from "@emotion/styled";
import { IconButton } from "@mui/material";
import { AddRoad, DomainAdd, DomainDisabled, FitScreen, RemoveRoad } from "@mui/icons-material";

/* eslint-disable-next-line */
export interface GraphButtonsProps {
  show: boolean;
  disabled?: boolean;
}

const GraphEditButtons = styled.div``;

const ControlButton = styled(IconButton)`
  position: absolute;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  left: 10px;
  border-radius: 20px;
  border: 1px solid gray;
`;
const FitButton = styled(ControlButton)`
  top: 10px;
`;
const AddNodeButton = styled(ControlButton)`
  top: 55px;
`;
const RemoveNodeButton = styled(ControlButton)`
  top: 100px;
`;
const AddEdgeButton = styled(ControlButton)`
  top: 145px;
`;
const RemoveEdgeButton = styled(ControlButton)`
  top: 190px;
`;

const StyledGraphButtons = styled.div``;

export function GraphButtons(props: GraphButtonsProps) {
  return props.show ? (
    <StyledGraphButtons>
      <FitButton id="fitButton" color="primary" title="Fit graph to canvas">
        <FitScreen />
      </FitButton>

      <GraphEditButtons>
        <AddNodeButton
          id="addNodeButton"
          disabled={props.disabled}
          color="primary"
          title="Add a node"
        >
          <DomainAdd />
        </AddNodeButton>

        <RemoveNodeButton
          id="removeNodeButton"
          disabled={props.disabled}
          color="primary"
          title="Remove selected node(s)"
        >
          <DomainDisabled />
        </RemoveNodeButton>

        <AddEdgeButton
          id="addEdgeButton"
          disabled={props.disabled}
          color="primary"
          title="Add edge(s) between selected nodes"
        >
          <AddRoad />
        </AddEdgeButton>

        <RemoveEdgeButton
          id="removeEdgeButton"
          disabled={props.disabled}
          color="primary"
          title="Remove edge(s) between selected nodes"
        >
          <RemoveRoad />
        </RemoveEdgeButton>
      </GraphEditButtons>
    </StyledGraphButtons>
  ) : undefined;
}

export default GraphButtons;
