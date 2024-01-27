import React, {
  forwardRef,
  MouseEvent,
  ReactNode,
  TouchEvent,
  useCallback,
  useState,
} from 'react';
import styled from '@emotion/styled';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { RowBox } from '../RowBox/RowBox';

const HandleArea = styled.div`
  width: 6px;
  height: 32px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-right: 2px;
`;

interface FloatingButtonProps {
  id: string;
  key: string;
  tooltip: string;
  style?: any;
  onClick: () => void;
  onMouseDown?: (event: MouseEvent) => void;
  onMouseUp?: (event: MouseEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
  children: ReactNode;
}

export const FloatingButton = forwardRef<HTMLDivElement, FloatingButtonProps>(
  (props: FloatingButtonProps, ref: React.ForwardedRef<HTMLDivElement>) => {
    const [mouseDownEvent, setMouseDownEvent] = useState<null | MouseEvent>(
      null,
    );

    const handleMouseDown = useCallback((event: MouseEvent) => {
      setMouseDownEvent(event);
      props.onMouseDown && props.onMouseDown(event);
    }, []);

    const handleMouseUp = useCallback(
      (event: any) => {
        if (
          mouseDownEvent &&
          mouseDownEvent.clientX === event.clientX &&
          mouseDownEvent.clientY === event.clientY
        ) {
          props.onClick();
        } else {
          props.onMouseUp && props.onMouseUp(event);
        }
        setMouseDownEvent(null);
      },
      [mouseDownEvent],
    );

    const handleTouchEnd = useCallback((ev: TouchEvent) => {
      props.onTouchEnd && props.onTouchEnd(ev);
    }, []);

    return (
      <Box
        id={props.id}
        key={props.key}
        style={{ ...props.style, width: 40, left: -8 }}
        onMouseDown={handleMouseDown}
        onTouchEnd={handleTouchEnd}
        onMouseUp={handleMouseUp}
        ref={ref}
      >
        <RowBox>
          <HandleArea
            className="draggable"
            style={{
              userSelect: 'none',
              paddingTop: 5,
              width: '8px',
              height: '32px',
              cursor: 'move',
            }}
          >
            <Typography style={{ color: 'blue' }}></Typography>
          </HandleArea>
          <Tooltip title={props.tooltip} placement="right">
            <IconButton
              style={{
                userSelect: 'none',
                width: '32px',
                height: '32px',
                border: '1px solid #00000020',
              }}
            >
              <Box style={{ marginTop: '4px' }}>{props.children}</Box>
            </IconButton>
          </Tooltip>
        </RowBox>
      </Box>
    );
  },
);
