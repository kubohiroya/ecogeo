import {
  Backdrop,
  Box,
  CircularProgress,
  IconButton,
  Slider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Animation } from '@mui/icons-material';
import { BACKDROP_TIMEOUT_MILLI_SEC } from './Constatns';

interface AutoLayoutButtonProps {
  autoLayoutStarted: boolean;
  speed: number;
  onChangeSpeed: (speed: number) => void;
  onToggleAutoGraphLayout: () => void;
}

const ControlButton = styled(IconButton)`
  position: absolute;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  left: 10px;
  border-radius: 20px;
  border: 1px solid gray;
`;
const FormLabel = styled(Box)`
  margin-left: 8px;
  padding-left: 8px;
`;
const SpeedButton = styled(ControlButton)`
  bottom: 65px;
`;
const SpeedSlider = styled(Slider)`
  width: 170px;
  padding-top: 18px;
  padding-bottom: 18px;
  margin-right: 5px;
  margin-left: 35px;
`;
const SpeedSliderContainer = styled.div`
  position: absolute;
  width: 230px;
  height: 75px;
  bottom: 35px;
  left: 55px;
  background-color: white;
  border-radius: 20px;
  padding-top: 5px;
  border: 1px solid gray;
  box-shadow: 0 0 1px gray;
`;

export const AutoLayoutButton = (props: AutoLayoutButtonProps) => {
  const [sumMenuShown, setSumMenuShown] = useState<boolean>(false);
  return (
    <>
      <SpeedButton
        color={'primary'}
        title={'Change speed of auto graph layout'}
        onClick={() => setSumMenuShown(!sumMenuShown)}
      >
        {props.autoLayoutStarted && (
          <CircularProgress
            style={{
              position: 'absolute',
              top: '2px',
              left: '2px',
              width: '90%',
              height: '90%',
            }}
          />
        )}
        <Animation
          style={{
            position: 'absolute',
            width: '70%',
            height: '70%',
            top: '6px',
            left: '6px',
          }}
        />
      </SpeedButton>
      <Backdrop
        open={sumMenuShown}
        onClick={() => {
          setTimeout(
            () => setSumMenuShown(false),
            BACKDROP_TIMEOUT_MILLI_SEC * 2
          );
          props.onToggleAutoGraphLayout();
        }}
        sx={{
          backgroundColor: '#00000030',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <SpeedSliderContainer>
          <FormLabel fontSize="small">
            Auto graph layout:
            {props.speed > 0 ? ' speed=' + props.speed * 100 + '%' : ' off'}
          </FormLabel>
          <SpeedSlider
            aria-label="Change speed of auto graph layout"
            color={props.autoLayoutStarted ? 'warning' : 'info'}
            value={props.speed}
            min={0}
            max={1}
            step={0.25}
            marks={[
              { value: 0, label: <Typography>off</Typography> },
              { value: 0.25, label: '25%' },
              { value: 0.5, label: '50%' },
              { value: 0.75, label: '75%' },
              { value: 1, label: '100%' },
            ]}
            onChange={(e: Event, value: number | number[]) =>
              props.onChangeSpeed(value as number)
            }
          />
        </SpeedSliderContainer>
      </Backdrop>
      <></>
    </>
  );
};
