import { Box, Button, Tooltip, Typography } from '@mui/material';
import React, { memo, useCallback } from 'react';
import {
  Domain,
  Flag,
  LocationCity,
  Villa,
  VillaOutlined,
} from '@mui/icons-material';
import styled from '@emotion/styled';
import { createGADMCountryUrl } from './CreateGADMUrl';

export type GADMResourceChipProps = {
  country: string;
  countryCode: string;
  levels: number[];
  urls: string[];
};

const NarrowMarginButton = styled(Button)`
  margin: 1px;
  padding-left: 4px;
`;
const SmallInlineIcon = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > svg {
    width: 16px;
    height: 16px;
  }
`;

export const GADMGeoJsonResourceChip = memo((props: GADMResourceChipProps) => {
  const handleClick = useCallback(
    (url: string) => () => {
      window.location.href = url;
    },
    [],
  );
  return (
    <NarrowMarginButton color="primary" variant="outlined" size="small">
      <Tooltip title={props.country}>
        <Typography
          onClick={handleClick(createGADMCountryUrl(props.countryCode))}
        >
          {props.countryCode}
        </Typography>
      </Tooltip>
      <SmallInlineIcon>
        {props.levels.includes(0) && (
          <Tooltip title="0">
            <Flag onClick={handleClick(props.urls[0])} />
          </Tooltip>
        )}
        {props.levels.includes(1) && (
          <Tooltip title="1">
            <LocationCity onClick={handleClick(props.urls[1])} />
          </Tooltip>
        )}
        {props.levels.includes(2) && (
          <Tooltip title="2">
            <Domain onClick={handleClick(props.urls[2])} />
          </Tooltip>
        )}
        {props.levels.includes(3) && (
          <Tooltip title="3">
            <Villa onClick={handleClick(props.urls[3])} />
          </Tooltip>
        )}
        {props.levels.includes(4) && (
          <Tooltip title="4">
            <VillaOutlined onClick={handleClick(props.urls[4])} />
          </Tooltip>
        )}
      </SmallInlineIcon>
    </NarrowMarginButton>
  );
});
