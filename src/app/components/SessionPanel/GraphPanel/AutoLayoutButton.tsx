import {
  Backdrop,
  CircularProgress,
  FormControlLabel,
  IconButton,
  Slider,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Animation } from '@mui/icons-material';
import { BACKDROP_TIMEOUT_MILLI_SEC } from './Constatns';

interface AutoLayoutButtonProps {
  speed: number;
  onChangeSpeed: (speed: number) => void;
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
const SpeedButton = styled(ControlButton)`
  bottom: 65px;
`;
const SpeedSlider = styled(Slider)`
  width: 120px;
  padding: 18px;
  margin-right: 5px;
  margin-left: 20px;
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
  padding-left: 5px;
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
        {props.speed > 0 && (
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
        onClick={() =>
          setTimeout(
            () => setSumMenuShown(false),
            BACKDROP_TIMEOUT_MILLI_SEC * 2
          )
        }
        sx={{
          backgroundColor: '#00000030',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <SpeedSliderContainer>
          <FormControlLabel
            control={
              <SpeedSlider
                aria-label="Change speed of auto graph layout"
                color={props.speed <= 0 ? 'info' : 'warning'}
                value={props.speed}
                min={-1}
                max={13}
                step={1}
                marks={[
                  {
                    value: -1,
                    label: <Typography>off</Typography>,
                  },
                  { value: 1, label: '1' },
                  { value: 3, label: '3' },
                  { value: 5, label: '5' },
                  { value: 8, label: '8' },
                  { value: 13, label: '13' },
                ]}
                onChange={(e: Event, value: number | number[]) =>
                  props.onChangeSpeed(value as number)
                }
              />
            }
            label={
              <Typography fontSize="small">
                Auto graph layout:
                {props.speed > 0 ? 'speed=' + props.speed : 'off'}
              </Typography>
            }
            labelPlacement={'top'}
          ></FormControlLabel>
        </SpeedSliderContainer>
      </Backdrop>
      <></>
    </>
  );
};
