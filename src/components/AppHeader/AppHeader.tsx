import styled from '@emotion/styled';
import React from 'react';
import { Typography } from '@mui/material';

/* eslint-disable-next-line */
export interface AppHeaderProps {
  children: string;
  startIcon?: React.ReactNode;
}

const StyledAppHeader = styled.div`
  padding-top: 8px;
  padding-bottom: 4px;
  align-self: center;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
`;

export function AppHeader(props: AppHeaderProps) {
  return (
    <StyledAppHeader>
      {props.startIcon}
      <Typography sx={{ fontSize: '1.8em', marginLeft: '0.2em' }}>
        {props.children}
      </Typography>
    </StyledAppHeader>
  );
}

export default AppHeader;
