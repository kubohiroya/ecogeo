import styled from "@emotion/styled";
import React, { useRef, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { hasFeatureDetectingHoverEvent } from "../../util/browserUtil";
import { ChartButtons } from "./ChartButtons/ChartButtons";
import { ChartTypes } from "../../type/ChartTypes";

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
`;

const CaptionBox = styled(Box)`
  position: absolute;
  bottom: 5px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

export function ChartPanel(props: ChartPanelProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  const chartItems = Object.values(ChartTypes).map((title) => ({
    label: title,
    value: title,
  }));

  return (
    <StyledChartPanel
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <ChartButtons
        show={hover || !hasFeatureDetectingHoverEvent()}
        scale={props.scale}
        onChangeScale={props.onChangeScale}
      />
      <ChartBox>{props.children}</ChartBox>
      <CaptionBox>
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
                {chartItem.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </CaptionBox>
    </StyledChartPanel>
  );
}

export default ChartPanel;
