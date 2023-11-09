import { ZoomIn } from '@mui/icons-material';
import { IconButton, Slider } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';

interface ChartButtonsProps {
  show: boolean;
  scale: number;
  onChangeScale: (scale: number) => void;
}

const ControlButton = styled(IconButton)`
  position: absolute;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  right: 10px;
  border-radius: 20px;
  border: 1px solid gray;
`;
const ScaleButton = styled(ControlButton)`
  top: 10px;
`;
const ScaleSlider = styled(Slider)`
  width: 120px;
  padding: 18px;
  margin-right: 5px;
  margin-left: 20px;
`;
const ScaleSliderContainer = styled.div`
  position: absolute;
  width: 210px;
  height: 50px;
  top: 10px;
  right: 55px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid gray;
  box-shadow: 0 0 1px gray;
`;

export const ChartButtons = (props: ChartButtonsProps) => {
  const [scaleSliderShown, setScaleSliderShown] = useState<boolean>(false);

  if (!props.show) {
    return null;
  }

  return (
    <>
      <ScaleButton
        color={'primary'}
        title={'Change scale to display chart'}
        onClick={() => setScaleSliderShown(!scaleSliderShown)}
      >
        <ZoomIn />
      </ScaleButton>
      {scaleSliderShown ? (
        <ScaleSliderContainer>
          <ScaleSlider
            aria-label="Change scale to display chart"
            value={props.scale}
            min={1}
            max={21}
            step={null}
            marks={[
              { value: 1, label: '1' },
              { value: 2, label: '' },
              { value: 3, label: '3' },
              { value: 5, label: '5' },
              { value: 8, label: '8' },
              { value: 13, label: '13' },
              { value: 21, label: '21' },
            ]}
            onChange={(e: Event, value: number | number[]) =>
              props.onChangeScale(value as number)
            }
          />
        </ScaleSliderContainer>
      ) : undefined}
      <></>
    </>
  );
};
