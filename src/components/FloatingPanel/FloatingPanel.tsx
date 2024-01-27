import React, {
  ComponentProps,
  forwardRef,
  MouseEvent,
  ReactNode,
  TouchEvent,
} from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from '@mui/material';
import { Close, OpenInFull, Remove } from '@mui/icons-material';
import { RowBox } from '../RowBox/RowBox';
import styled from '@emotion/styled';

const FloatingCard = styled(Card)`
  background-color: rgba(255, 255, 255, 0.8);
`;

type FloatingPanelProps = {
  id: string;
  key: string;
  title: string;
  icon: ReactNode;
  rowHeight: number;
  subheader?: string;
  children: ReactNode;
  style?: any;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  titleBarMode: 'win' | 'mac';
  setToFront: () => void;
  hide?: () => void;
} & ComponentProps<'div'>;

const MiniWindowControlButton = styled(IconButton)`
  padding: 2px;
  height: 18px;
  margin: 7px 4px 3px 0;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.2);

  .MuiSvgIcon-root {
    width: 12px;
    height: 12px;
  }
`;

const MiniWindowTitleIcon = styled(Box)`
  margin-top: 4px;
`;

export const FloatingPanel = forwardRef<HTMLDivElement, FloatingPanelProps>(
  (
    {
      id,
      key,
      title,
      icon,
      rowHeight,
      subheader,
      children,
      style,
      onMouseDown,
      onMouseUp,
      onTouchEnd,
      setToFront,
      hide,
      titleBarMode,
    }: FloatingPanelProps,
    ref,
  ) => {
    const hideMe = () => {
      hide && hide();
    };

    return (
      <FloatingCard
        id={id}
        key={key}
        style={{ ...style, borderRadius: '8px' }}
        ref={ref}
        onMouseDown={(ev) => {
          const rect = document.getElementById(id)!.getBoundingClientRect();
          if (
            titleBarMode == 'win' &&
            rect.right - ev.clientX < 26 &&
            ev.clientY - rect.top < 26
          ) {
            return;
          }

          setToFront();
          onMouseDown && onMouseDown(ev);
        }}
        onMouseUp={onMouseUp}
        onTouchEnd={onTouchEnd}
      >
        <CardHeader
          title={
            <Box
              style={{
                userSelect: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: rowHeight + 'px',
                display: 'flex',
                flexDirection: 'row',
                marginLeft: '8px',
              }}
            >
              {titleBarMode == 'mac' && (
                <>
                  <MiniWindowControlButton
                    size="small"
                    onClick={() => {
                      console.log('close');
                    }}
                  >
                    <Close />
                  </MiniWindowControlButton>
                  <MiniWindowControlButton
                    size="small"
                    onClick={() => {
                      console.log('remove');
                    }}
                  >
                    <Remove />
                  </MiniWindowControlButton>
                  <MiniWindowControlButton
                    size="small"
                    onClick={() => {
                      console.log('open in full');
                    }}
                  >
                    <OpenInFull />
                  </MiniWindowControlButton>
                </>
              )}
              <RowBox className="draggable">
                <MiniWindowTitleIcon>{icon}</MiniWindowTitleIcon>
                <Typography style={{ marginLeft: '4px', marginTop: '4px' }}>
                  {title}
                </Typography>
              </RowBox>
              {titleBarMode == 'win' && (
                <IconButton
                  size="small"
                  aria-label="close"
                  style={{ marginRight: '6px', zIndex: 100 }}
                  onClick={hideMe}
                >
                  <Close />
                </IconButton>
              )}
            </Box>
          }
          style={{
            cursor: 'move',
            height: '16px',
            backgroundColor: 'rgba(255,255,255,0.90)',
            padding: '8px',
            borderBottom: '1px solid rgba(0,0,0,0.1)',
          }}
          titleTypographyProps={{ fontSize: '16px' }}
        ></CardHeader>
        <CardContent>{children}</CardContent>
        <CardActions></CardActions>
      </FloatingCard>
    );
  },
);
