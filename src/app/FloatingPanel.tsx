import styled from '@emotion/styled';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
} from '@mui/material';
import React, { useCallback, useRef } from 'react';
import { Close } from '@mui/icons-material';
import { DraggableData, Position, ResizableDelta, Rnd } from 'react-rnd';
import { DraggableEvent } from 'react-draggable';
import { useImmerAtom } from 'jotai-immer';
import {
  fileAtom,
  layerAtom,
  searchAtom,
} from './pages/RealWorldSim/RealWorldSimPage';

const CardTitle = styled(Box)`
  display: flex;
  gap: 10px;
  margin: 5px;
  height: 30px;
  border-bottom: black 1px solid;
`;

const CloseIconButton = styled(IconButton)`
  position: absolute;
  top: 9px;
  right: 7px;
  width: 20px;
  height: 20px;
`;

const FloatingCard = styled(Card)`
  border-radius: 16px;
  margin-top: 0;
  background-color: rgba(255, 255, 255, 0.8);
`;

export interface FloatingPanelStateBase {
  minimize?: boolean;
  width: number;
}

export interface FloatingPanelState extends FloatingPanelStateBase {
  open: boolean;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  minimize?: boolean;
}

export interface FloatingPanelProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  open: boolean;
  zIndex: number;
  onClick: (id: string) => void;
  onClose: () => void;
  titleBarMode?: boolean;
  children?: React.ReactNode;
}

const HEADER_HEIGHT = 32;

export const FloatingPanel = (props: FloatingPanelProps) => {
  const ref = useRef(null);
  const [searchState, setSearchState] = useImmerAtom(searchAtom);
  const [fileState, setFileState] = useImmerAtom(fileAtom);
  const [layerState, setLayerState] = useImmerAtom(layerAtom);

  const getter =
    props.id == 'search'
      ? searchState
      : props.id == 'file'
        ? fileState
        : layerState;
  const setter =
    props.id == 'search'
      ? setSearchState
      : props.id == 'file'
        ? setFileState
        : setLayerState;

  const toggleMinimizeLayerPanel = useCallback(
    () =>
      setter((draft) => {
        draft.minimize = !draft.minimize;
      }),
    [setSearchState, setFileState, setLayerState],
  );

  const onDrag = useCallback(
    (e: DraggableEvent, d: DraggableData) => {
      setter((draft) => {
        if (ref.current) {
          draft.x = d.x;
          draft.y = d.y;
        }
      });
    },
    [ref, setSearchState, setFileState, setLayerState],
  );

  const onResize = useCallback(
    (
      e: MouseEvent | TouchEvent,
      dir: any,
      ref: any,
      delta: ResizableDelta,
      position: Position,
    ) => {
      !props.titleBarMode &&
        setter((draft) => {
          if (ref) {
            draft.width = ref.offsetWidth;
            if (ref.style.height && !Number.isNaN(ref.style.height))
              draft.height = ref.style.height;
            draft.x = position.x;
            draft.y = position.y;
          }
        });
    },
    [ref, setSearchState, setFileState, setLayerState],
  );

  const handleClick = useCallback(() => {
    props.onClick(props.id);
  }, []);

  const hideLayerPanel = useCallback(() => {
    props.onClose();
  }, []);

  if (Number.isNaN(getter.height)) {
    return;
  }

  return (
    <div ref={ref}>
      <Rnd
        style={{
          display: getter.open ? 'block' : 'none',
        }}
        scale={0.5}
        size={{
          width: getter.width,
          height: getter.minimize ? HEADER_HEIGHT : getter.height,
        }}
        minHeight={HEADER_HEIGHT}
        position={{
          x: getter.x,
          y: getter.y,
        }}
        onDragStop={onDrag}
        onResize={onResize}
      >
        <FloatingCard
          onClick={handleClick}
          variant="outlined"
          style={{
            width: getter.width,
            height: getter.minimize ? HEADER_HEIGHT : getter.height,
            zIndex: props.zIndex,
          }}
        >
          <CardTitle
            className="handle"
            onDoubleClick={toggleMinimizeLayerPanel}
          >
            <Box onClick={toggleMinimizeLayerPanel}>{props.icon}</Box>{' '}
            <Typography>{props.title}</Typography>
            {props.titleBarMode && props.children}
            <CloseIconButton onClick={hideLayerPanel}>
              <Close />
            </CloseIconButton>
          </CardTitle>
          {!getter.minimize &&
            !props.titleBarMode &&
            getter.height &&
            !Number.isNaN(getter.height) && (
              <>
                <CardContent
                  style={{
                    overflow: 'scroll',
                    height: `calc(${getter.height} - 61px)`,
                  }}
                >
                  {props.children}
                </CardContent>
                <CardActions></CardActions>
              </>
            )}
        </FloatingCard>
      </Rnd>
    </div>
  );
};
