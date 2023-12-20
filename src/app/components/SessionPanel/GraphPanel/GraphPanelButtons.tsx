import styled from '@emotion/styled';
import { Icon, IconButton, SvgIcon } from '@mui/material';
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
import { GraphPanelButtonsState } from './GraphPanelButtonsState'; /* eslint-disable-next-line */

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

const DomainDel = styled(Icon)`
  width: 24px;
  height: 24px;
  margin: 3px;
  // background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1szh1ks" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DomainAddIcon"><path d="M12 7V3H2v18h14v-2h-4v-2h2v-2h-2v-2h2v-2h-2V9h8v6h2V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm14 12v2h-2h2v2h2zm-6-8h-2v2h2v-2zm0 4h-2v2h2v-2z"></path></svg>');
  //  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1szh1ks" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="RemoveRoadIcon"><path d="M18 4h2v9h-2zM4 4h2v16H4zm7 0h2v4h-2zm0 6h2v4h-2zm0 6h2v4h-2zm11.5.41L21.09 15 19 17.09 16.91 15l-1.41 1.41 2.09 2.09-2.09 2.09L16.91 22 19 19.91 21.09 22l1.41-1.41-2.09-2.09z"></path></svg>');
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium MuiBox-root css-1szh1ks" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DomainRemoveIcon"><path d="m18 11h-2v2h2z"/> <path d="m12 7v-4h-10v18h14v-2h-4v-2h2v-2h-2v-2h2v-2h-2v-2h8v6h2v-8zm-6 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm4 12h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2z"/> <g transform="rotate(45 21.129 19.875)"> <rect x="15.988" y="19.011" width="6.8875" height="1.9946"/> <rect transform="rotate(90)" x="16.658" y="-20.289" width="6.8875" height="1.9946"/></g></svg>');
`;

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
