import { Box } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ResizableDelta, Rnd } from 'react-rnd';
import styled from '@emotion/styled';
import SplitPane, { Pane } from 'split-pane-react';
import { UIState } from '../../model/UIState';
import { Draft } from 'immer';

const GraphAndChartContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 0 0 8px 8px;
  margin: 0;
  padding: 0;
  overflow: scroll;
  background-color: #ccc;
  box-shadow: 3px 3px 0 0 #bbb inset;
`;

const StyledSplitPane = styled(SplitPane)``;

const StyledPane = styled(Pane)`
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #ddd;
  background: #f8f8f8;
  box-shadow: 1px 0 10px rgba(0, 0, 0, 0.3);
  margin: 1px;
  padding: 0;
  border-radius: 8px;
`;

export type SessionLayoutPanelProps = {
  uiState: UIState;
  setUIState: (fn: (draft: Draft<UIState>) => void) => void;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

const horizontalMargin = 10;
const defaultContainerHeight = 500;

export const SessionLayoutPanel = React.memo(
  (props: SessionLayoutPanelProps) => {
    const containerRef = useRef<null | HTMLDivElement>(null);

    const [prevSplitPaneHeight, setPrevSplitPaneHeight] = useState<number>(
      defaultContainerHeight
    );

    useEffect(() => {
      window.addEventListener('resize', () => changeHeight());
    }, []);

    const { uiState, setUIState } = props;

    useEffect(() => {
      if (containerRef.current) {
        const initialChartWidth = Math.min(
          containerRef.current.clientWidth - horizontalMargin,
          defaultContainerHeight
        );
        const initialChartHeight =
          uiState.splitPanelHeight || defaultContainerHeight;

        setUIState((draft: UIState) => {
          if (containerRef.current) {
            draft.splitPanelSizes = [
              containerRef.current.clientWidth -
                initialChartWidth -
                horizontalMargin,
              initialChartHeight,
            ];
            draft.splitPanelHeight = initialChartHeight;
          }
        });
      }
    }, [containerRef.current, setUIState]);

    const onChangeHeightStart = useCallback(() => {
      containerRef.current &&
        setPrevSplitPaneHeight(containerRef.current.clientHeight);
    }, []);

    const changeHeight = useCallback(
      (newHeight?: number) => {
        if (containerRef.current) {
          setUIState((draft: UIState) => {
            draft.splitPanelHeight = newHeight || draft.splitPanelHeight;
          });
        }
      },
      [containerRef.current, setUIState]
    );

    const onChangeHeight = useCallback(
      (
        e: MouseEvent | TouchEvent,
        dir: any,
        elementRef: HTMLElement,
        delta: ResizableDelta
      ) => {
        const newHeight = prevSplitPaneHeight + delta.height;
        changeHeight(newHeight);
      },
      [prevSplitPaneHeight]
    );

    const onChangeWidthSplit = useCallback(
      (sizes: number[]) => {
        setUIState((draft) => {
          draft.splitPanelSizes = sizes;
        });
      },
      [uiState.splitPanelSizes, setUIState]
    );

    return (
      <GraphAndChartContainer
        ref={containerRef}
        style={{
          width: '100%',
          height: uiState.splitPanelHeight + 'px',
        }}
      >
        <Rnd
          style={{
            marginLeft: '9px',
            marginRight: '9px',
            paddingBottom: '4px',
          }}
          size={{
            width: containerRef.current?.clientWidth || 1,
            height: uiState.splitPanelHeight,
          }}
          onResizeStart={onChangeHeightStart}
          onResize={onChangeHeight}
          enableResizing={{
            right: false,
            top: false,
            bottom: true,
            left: false,
            topRight: false,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
          }}
          dragAxis={'y'}
          disableDragging={true}
        >
          <StyledSplitPane
            split={'vertical'}
            sizes={uiState.splitPanelSizes}
            onChange={onChangeWidthSplit}
            sashRender={(index: number, active: boolean) => null}
          >
            <StyledPane>{props.left}</StyledPane>
            <StyledPane>{props.right}</StyledPane>
          </StyledSplitPane>
        </Rnd>
      </GraphAndChartContainer>
    );
  }
);
