import styled from '@emotion/styled';
import { AddRoad, DomainAdd, RemoveRoad } from '@mui/icons-material';
import { Box, IconButton, SvgIcon } from '@mui/material';
import React from 'react';
import { MapPanelButtonsState } from 'src/app/components/SessionPanel/MapPanel/MapPanelButtonsState';

/* eslint-disable-next-line */
export interface MapPanelButtonsProps {
  shown: boolean;
  onFit: () => void;
  onAddLocation: () => void;
  onRemoveLocation: () => void;
  onAddEdge: () => void;
  onRemoveEdge: () => void;
  onToggleAutoGraphLayout: () => void;
  autoGraphLayoutStarted: boolean;
  autoLayoutSpeed: number;
  setAutoLayoutSpeed: (autoLayoutSpeed: number) => void;
  state: MapPanelButtonsState;
  onUndo: () => void;
  onRedo: () => void;
}

export const ControlButton = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.5);
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border-radius: 20px;
  border: 1px solid gray;
  z-index: 101;
`;

const AddNodeButton = styled(ControlButton)``;
const RemoveNodeButton = styled(ControlButton)``;
const AddEdgeButton = styled(ControlButton)``;
const RemoveEdgeButton = styled(ControlButton)``;

type EditPanelComponentProps = {
  state: MapPanelButtonsState;
  onAddLocation: () => void;
  onRemoveLocation: () => void;
  onAddEdge: () => void;
  onRemoveEdge: () => void;
};

export const EditPanelComponent = (props: EditPanelComponentProps) => (
  <Box style={{ display: 'flex', gap: '10px' }}>
    <AddNodeButton
      id="addNodeButton"
      disabled={!props.state?.addLocation}
      color="primary"
      title="Add a location"
      onClick={props.onAddLocation}
    >
      <DomainAdd />
    </AddNodeButton>

    <RemoveNodeButton
      id="removeNodeButton"
      disabled={!props.state?.removeLocation}
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
      disabled={!props.state?.addEdge}
      color="primary"
      title="Add edge(s) between selected locations"
      onClick={props.onAddEdge}
    >
      <AddRoad />
    </AddEdgeButton>

    <RemoveEdgeButton
      id="removeEdgeButton"
      disabled={!props.state?.removeEdge}
      color="primary"
      title="Remove edge(s) between selected locations"
      onClick={props.onRemoveEdge}
    >
      <RemoveRoad />
    </RemoveEdgeButton>
  </Box>
);
