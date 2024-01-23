import styled from '@emotion/styled';
import { IconButton } from '@mui/material';

export const OverlayControlButton = styled(IconButton)`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.5);
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  left: 10px;
  border-radius: 20px;
  border: 1px solid gray;
  z-index: 101;
`;
