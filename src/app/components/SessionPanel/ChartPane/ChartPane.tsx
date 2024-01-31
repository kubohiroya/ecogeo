import styled from '@emotion/styled';
import React, { ReactElement, useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from '@mui/material';
import { hasFeatureDetectingHoverEvent } from '../../../utils/browserUtil';
import { ChartButtons } from './ChartButtons';
import { ChartType, chartTypes } from '../../../models/ChartType';
import {
  Agriculture,
  AttachMoneyRounded,
  Factory,
  PriceChange,
  RequestQuoteRounded,
} from '@mui/icons-material';

/* eslint-disable-next-line */
export interface ChartPanelProps {
  scale: number;
  onChangeScale: (scale: number) => void;
  chartType: string;
  onChangeChartType: (chartTitle: string) => void;
  children?: React.ReactNode;
}

const StyledChartPanel = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 8px;
`;
const ChartBox = styled(Box)`
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 8px;
  background-color: #f5f5f5;
`;

const ChartCaptionBox = styled(Box)`
  position: absolute;
  bottom: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const chartItemIcons: Record<string, ReactElement> = {
  [ChartType.ManufactureShare]: <Factory />,
  [ChartType.AgricultureShare]: <Agriculture />,
  [ChartType.PriceIndex]: <PriceChange />,
  [ChartType.NominalWage]: <RequestQuoteRounded />,
  [ChartType.RealWage]: <AttachMoneyRounded />,
};

const chartItems = Object.values(chartTypes).map((title) => ({
  label: title,
  icon: chartItemIcons[title],
  value: title,
}));

const StyledListItem = styled(Box)`
  display: flex;
  align-items: center;
  margin: 0;
`;
const StyledIconBox = styled(Box)`
  justify-content: center;
  margin-right: 8px;
  vertical-align: middle;
`;

function ChartCaptionPanel(props: {
  chartType: string;
  onChangeChartType: (chartTitle: string) => void;
}) {
  return (
    <FormControl size="small">
      <InputLabel id="select-label">Chart</InputLabel>
      <Select
        labelId="select-label"
        id="chart-title-select"
        value={props.chartType}
        label="title"
        onChange={(event) => props.onChangeChartType(event.target.value)}
      >
        {chartItems.map((chartItem) => (
          <MenuItem key={chartItem.value} value={chartItem.value}>
            <StyledListItem>
              <StyledIconBox>{chartItem.icon}</StyledIconBox>
              <ListItemText>{chartItem.label}</ListItemText>
            </StyledListItem>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export const ChartPane = React.memo((props: ChartPanelProps) => {
  const [hover, setHover] = useState(false);

  return (
    <StyledChartPanel
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ChartButtons
        shown={hover || !hasFeatureDetectingHoverEvent()}
        scale={props.scale}
        onChangeScale={props.onChangeScale}
      />
      <ChartBox>{props.children}</ChartBox>
      <ChartCaptionBox>
        <ChartCaptionPanel
          chartType={props.chartType}
          onChangeChartType={props.onChangeChartType}
        />
      </ChartCaptionBox>
    </StyledChartPanel>
  );
});
