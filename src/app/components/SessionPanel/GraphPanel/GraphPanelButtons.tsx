import styled from '@emotion/styled';
import { IconButton } from '@mui/material';
import {
  AddRoad,
  DomainAdd,
  DomainDisabled,
  FitScreen,
  Redo,
  RemoveRoad,
  Undo,
} from '@mui/icons-material';
import React from 'react';
import { AutoLayoutButton } from './AutoLayoutButton';
import { LayerSwitchButton } from './LayerSwitchButton';
import { GraphPanelButtonsState } from './GraphPanelButtonsState'; /* eslint-disable-next-line */

/* eslint-disable-next-line */
export interface GraphPanelButtonsProps {
  show: boolean;
  onFit: () => void;
  onAddLocation: () => void;
  onRemoveLocation: () => void;
  onAddEdge: () => void;
  onRemoveEdge: () => void;
  autoLayoutSpeed: number;
  setAutoLayoutSpeed: (autoLayoutSpeed: number) => void;
  mapLayer: boolean;
  setMapLLayer: (mapLayer: boolean) => void;
  state: GraphPanelButtonsState;

  onUndo: () => void;
  onRedo: () => void;
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
const StyledAutoLayoutButton = styled(AutoLayoutButton)``;
const StyledLayerSwitchButton = styled(LayerSwitchButton)``;

const StyledUndoButton = styled(ControlButton)`
  bottom: 165px;
`;
const StyledRedoButton = styled(ControlButton)`
  bottom: 120px;
`;

const StyledGraphButtons = styled.div``;

export const GraphPanelButtons = React.memo((props: GraphPanelButtonsProps) => {
  return props.show ? (
    <StyledGraphButtons>
      <FitButton
        id="fitButton"
        color="primary"
        title="Fit graph to canvas"
        onClick={props.onFit}
      >
        <FitScreen />
      </FitButton>

      <GraphEditButtons>
        <AddNodeButton
          id="addNodeButton"
          disabled={!props.state.addLocation}
          color="primary"
          title="Add a location"
          onClick={props.onAddLocation}
        >
          <DomainAdd />
        </AddNodeButton>

        <RemoveNodeButton
          id="removeNodeButton"
          disabled={!props.state.removeLocation}
          color="primary"
          title="Remove selected location(s)"
          onClick={props.onRemoveLocation}
        >
          <DomainDisabled />
        </RemoveNodeButton>

        <AddEdgeButton
          id="addEdgeButton"
          disabled={!props.state.addEdge}
          color="primary"
          title="Add edge(s) between selected locations"
          onClick={props.onAddEdge}
        >
          <AddRoad />
        </AddEdgeButton>

        <RemoveEdgeButton
          id="removeEdgeButton"
          disabled={!props.state.removeEdge}
          color="primary"
          title="Remove edge(s) between selected locations"
          onClick={props.onRemoveEdge}
        >
          <RemoveRoad />
        </RemoveEdgeButton>

        <StyledAutoLayoutButton
          speed={props.autoLayoutSpeed}
          onChangeSpeed={props.setAutoLayoutSpeed}
        />

        <StyledLayerSwitchButton
          mapLayer={props.mapLayer}
          onChangeMapLayer={props.setMapLLayer}
        />

        <StyledUndoButton
          id="undoButton"
          disabled={!props.state.undo}
          color="primary"
          title="Undo"
          onClick={props.onUndo}
        >
          <Undo />
        </StyledUndoButton>

        <StyledRedoButton
          id="redoButton"
          disabled={!props.state.redo}
          color="primary"
          title="Redo"
          onClick={props.onRedo}
        >
          <Redo />
        </StyledRedoButton>
      </GraphEditButtons>
    </StyledGraphButtons>
  ) : undefined;
});
export default GraphPanelButtons;
