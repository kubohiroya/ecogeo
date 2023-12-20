import styled from '@emotion/styled';
import React, { ReactElement, useCallback, useState } from 'react';
import GraphPanelButtons from './GraphPanelButtons';
import { hasFeatureDetectingHoverEvent } from '../../../util/browserUtil';
import { GraphPanelButtonsState } from './GraphPanelButtonsState';

/* eslint-disable-next-line */
export interface GraphPanelProps {
  hideGraphEditButtons: boolean;
  state: GraphPanelButtonsState;
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
  mapLayer: boolean;
  setMapLayer: (layer: boolean) => void;
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
  // background-color: aquamarine;
  overflow: hidden;
`;

export const GraphPanel = React.memo((props: GraphPanelProps) => {
  const [hover, setHover] = useState(false);
  const setHoverEnabled = useCallback(() => {
    setHover(true);
  }, []);
  const setHoverDisabled = useCallback(() => {
    setHover(false);
  }, []);
  return (
    <StyledGraphPanel
      onMouseEnter={setHoverEnabled}
      onMouseLeave={setHoverDisabled}
    >
      <GraphPanelButtons
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
        mapLayer={props.mapLayer}
        setMapLLayer={props.setMapLayer}
      />

      {props.children}
    </StyledGraphPanel>
  );
});

export default GraphPanel;
