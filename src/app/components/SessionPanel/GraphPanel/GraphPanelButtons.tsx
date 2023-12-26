import styled from '@emotion/styled';
import { Box, SvgIcon } from '@mui/material';
import {
  AddRoad,
  DomainAdd,
  FitScreen,
  Redo,
  RemoveRoad,
  Undo,
} from '@mui/icons-material';
import React from 'react';
import { AutoLayoutButton } from './AutoLayoutButton';
import { LayerSwitchButton } from './LayerSwitchButton';
import { GraphPanelButtonsState } from './GraphPanelButtonsState';
import { OverlayControlButton } from './OverlayControlButton'; /* eslint-disable-next-line */

/* eslint-disable-next-line */
export interface GraphPanelButtonsProps {
  show: boolean;
  onFit: () => void;
  onAddLocation: () => void;
  onRemoveLocation: () => void;
  onAddEdge: () => void;
  onRemoveEdge: () => void;
  onToggleAutoGraphLayout: () => void;
  autoGraphLayoutStarted: boolean;
  autoLayoutSpeed: number;
  setAutoLayoutSpeed: (autoLayoutSpeed: number) => void;
  mapLayer: boolean;
  setMapLLayer: (mapLayer: boolean) => void;
  state: GraphPanelButtonsState;

  onUndo: () => void;
  onRedo: () => void;
}

const GraphEditButtons = styled.div`
  position: absolute;
  display: flex;
`;

const FitButton = styled(OverlayControlButton)`
  top: 10px;
`;
const AddNodeButton = styled(OverlayControlButton)`
  top: 55px;
`;
const RemoveNodeButton = styled(OverlayControlButton)`
  top: 100px;
`;
const AddEdgeButton = styled(OverlayControlButton)`
  top: 145px;
`;
const RemoveEdgeButton = styled(OverlayControlButton)`
  top: 190px;
`;
const StyledAutoLayoutButton = styled(AutoLayoutButton)``;
const StyledLayerSwitchButton = styled(LayerSwitchButton)``;

const StyledUndoButton = styled(OverlayControlButton)`
  // bottom: 165px;
  top: 55px;
`;
const StyledRedoButton = styled(OverlayControlButton)`
  // bottom: 120px;
  top: 100px;
`;

const StyledGraphButtons = styled.div``;

export const GraphPanelButtons = React.memo((props: GraphPanelButtonsProps) => {
  return props.show ? (
    <StyledGraphButtons>
      <GraphEditButtons>
        <Box>
          <FitButton
            id="fitButton"
            color="primary"
            title="Fit graph to canvas"
            onClick={props.onFit}
          >
            <FitScreen />
          </FitButton>

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
            <SvgIcon>
              <path d="M18 11h-2v2h2z" />
              <path d="M12 7V3H2v18h14v-2h-4v-2h2v-2h-2v-2h2v-2h-2V9h8v6h2V7zM6 19H4v-2h2zm0-4H4v-2h2zm0-4H4V9h2zm0-4H4V5h2zm4 12H8v-2h2zm0-4H8v-2h2zm0-4H8V9h2zm0-4H8V5h2z" />
              <path d="m21.398 15.596-1.662 1.664-1.63-1.631-1.413 1.41 1.631 1.63-1.795 1.798 1.41 1.41 1.795-1.795 1.83 1.828 1.41-1.412-1.828-1.828 1.665-1.664-1.413-1.41z" />
            </SvgIcon>
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

          <Box style={{ position: 'relative', top: 0, left: '50px' }}>
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

            <StyledAutoLayoutButton
              onToggleAutoGraphLayout={props.onToggleAutoGraphLayout}
              autoLayoutStarted={props.autoGraphLayoutStarted}
              speed={props.autoLayoutSpeed}
              onChangeSpeed={props.setAutoLayoutSpeed}
            />

            <StyledLayerSwitchButton
              mapLayer={props.mapLayer}
              onChangeMapLayer={props.setMapLLayer}
            />
          </Box>
        </Box>
      </GraphEditButtons>
    </StyledGraphButtons>
  ) : undefined;
});
export default GraphPanelButtons;
