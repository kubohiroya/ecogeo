import styled from '@emotion/styled';
import React from 'react';
import { Slider, Tooltip, Typography } from '@mui/material';

export interface LabelSliderProps {
  title: string;
  icon: any;
  label: string;
  step: number;
  marks: {
    value: number;
    label: string;
  }[];
  min: number;
  max: number;
  value: number;
  onChange: (event: Event, newValue: number | number[]) => void;
}

const SliderWithLabel = styled.div`
  display: flex;
  gap: 10px;
  align-content: center;
  align-items: center;
`;

const KeyValuePair = styled.div`
  display: flex;
  gap: 4px;
  margin-top: -5px;
  vertical-align: top;
`;

const SliderLabel = styled.div`
  padding-top: 15px;
  text-align: center;
  width: 65px;
`;

const StyledSlider = styled(Slider)`
  margin-top: 10px;
`;

export function LabelSlider(props: LabelSliderProps) {
  return (
    <SliderWithLabel>
      <Tooltip title={props.title}>
        <SliderLabel>
          {props.icon}
          <KeyValuePair>
            <Typography>{props.label} =</Typography>
            <Typography>{props.value}</Typography>
          </KeyValuePair>
        </SliderLabel>
      </Tooltip>
      <StyledSlider
        aria-label={props.label}
        value={props.value}
        getAriaValueText={(value) => `${value}`}
        step={props.step}
        marks={props.marks}
        min={props.min}
        max={props.max}
        valueLabelDisplay="auto"
        onChange={props.onChange}
      />
    </SliderWithLabel>
  );
}

export default LabelSlider;
