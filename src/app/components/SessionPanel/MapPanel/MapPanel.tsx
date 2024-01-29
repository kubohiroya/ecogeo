import styled from '@emotion/styled';
import React, { ReactElement, useCallback, useState } from 'react';
import MapPanelButtons from './MapPanelButtons';
import { MapPanelButtonsState } from './MapPanelButtonsState';
import { hasFeatureDetectingHoverEvent } from '../../../utils/browserUtil';
import { Country } from '../../../models/Country';

/* eslint-disable-next-line */
export interface MapPanelProps {
  hideGraphEditButtons: boolean;
  state: MapPanelButtonsState;
  children?: ReactElement;
  onFit: () => void;
  onAddLocation: () => void;
  onRemoveLocation: () => void;
  onAddEdge: () => void;
  onRemoveEdge: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onToggleAutoGraphLayout: () => void;
  autoGraphLayoutStarted: boolean;
  autoGraphLayoutSpeed: number;
  setAutoGraphLayoutSpeed: (autoLayoutSpeed: number) => void;
  country: Country;
}

const StyledMapPanel = styled.div`
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
  opacity: 1;
  border-radius: 8px;
  overflow: hidden;
`;

export const MapPanel = React.memo((props: MapPanelProps) => {
  const [hover, setHover] = useState(false);
  const setHoverEnabled = useCallback(() => {
    setHover(true);
  }, []);
  const setHoverDisabled = useCallback(() => {
    setHover(false);
  }, []);
  return (
    <StyledMapPanel
      onMouseEnter={setHoverEnabled}
      onMouseLeave={setHoverDisabled}
    >
      <MapPanelButtons
        country={props.country}
        show={hover || !hasFeatureDetectingHoverEvent()}
        state={props.state}
        onFit={props.onFit}
        onAddLocation={props.onAddLocation}
        onRemoveLocation={props.onRemoveLocation}
        onAddEdge={props.onAddEdge}
        onRemoveEdge={props.onRemoveEdge}
        onUndo={props.onUndo}
        onRedo={props.onRedo}
        onToggleAutoGraphLayout={props.onToggleAutoGraphLayout}
        autoGraphLayoutStarted={props.autoGraphLayoutStarted}
        autoLayoutSpeed={props.autoGraphLayoutSpeed}
        setAutoLayoutSpeed={props.setAutoGraphLayoutSpeed}
      />
      {props.children}
    </StyledMapPanel>
  );
});

export default MapPanel;
