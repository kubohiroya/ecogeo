import styled from '@emotion/styled';
import {
  AccessTime,
  PauseCircle,
  PlayCircle,
  RestartAlt,
} from '@mui/icons-material';
import { Button, ButtonGroup, Slider, Tooltip } from '@mui/material';
import React from 'react';

const StyledTimeControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  vertical-align: middle;
  align-content: center;
  align-items: center;
  margin-left: 0;
  margin-right: 8px;
  gap: 8px;
`;
const StyledButtonGroup = styled(ButtonGroup)``;
const StyledButton = styled(Button)`
  border-radius: 24px;
  padding-left: 20px;
  padding-right: 20px;
`;
const ButtonPanel = styled.div`
  display: flex;
  gap: 5px;
`;
const TimeCounter = styled.div`
  display: flex;
  align-items: flex-end;
  margin-left: 8px;
  margin-right: 8px;
  font-size: 1em;
  white-space: nowrap;
  gap: 8px;

  input {
    text-align: right;
  }
`;
const SpeedSlider = styled(Slider)``;
const TimeSliderContainer = styled.div`
  display: flex;
  width: 95%;
  gap: 15px;
  align-content: center;
  align-items: center;
`;

/* eslint-disable-next-line */
export interface TimeControlPanelProps {
  isStarted: boolean;
  counter: number;
  intervalScale: number;
  changeIntervalScale: (newValue: number) => void;
  start: () => void;
  reset: () => void;
  stop: () => void;
}

const buttonAnimation = (speed: number) => ({
  animation: `blinking ${
    1.5 - speed
  }s ease-in-out infinite alternate; @keyframes blinking { 0% { background-color: rgb(230,138,35);} 100% { background-color: rgb(180,88,25); }}`,
  color: '#444',
});

export function TimeControlPanel(props: TimeControlPanelProps) {
  return (
    <StyledTimeControlPanel>
      <ButtonPanel>
        <StyledButtonGroup
          variant="outlined"
          aria-label="outlined primary button group"
        >
          <StyledButton
            variant="contained"
            color="primary"
            onClick={props.start}
            disabled={props.isStarted}
            startIcon={<PlayCircle />}
          >
            Start
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={props.stop}
            disabled={!props.isStarted}
            sx={{
              ...(props.isStarted ? buttonAnimation(props.intervalScale) : {}),
            }}
            startIcon={<PauseCircle />}
          >
            Stop
          </StyledButton>
        </StyledButtonGroup>

        <StyledButton
          onClick={props.reset}
          variant="contained"
          color="primary"
          sx={{
            ...(props.isStarted ? buttonAnimation(props.intervalScale) : {}),
          }}
          startIcon={<RestartAlt />}
        >
          Reset
        </StyledButton>
      </ButtonPanel>

      <TimeSliderContainer>
        <Tooltip title={'Elapsed time'}>
          <TimeCounter>
            <AccessTime />
            <input type="text" value={props.counter} size={6} disabled />
          </TimeCounter>
        </Tooltip>
        <Tooltip title={'Simulation Speed'}>
          <SpeedSlider
            aria-label={'Simulation speed'}
            value={props.intervalScale}
            step={0.01}
            marks={[
              { value: 0, label: '🐢' },
              { value: 0.2, label: '20%' },
              { value: 0.4, label: '40%' },
              { value: 0.6, label: '60%' },
              { value: 0.8, label: '80%' },
              { value: 1, label: '🐇' },
            ]}
            onChange={(event: Event, newValue: number | number[]) => {
              props.changeIntervalScale(newValue as number);
            }}
            min={0}
            max={1}
            valueLabelDisplay="auto"
            sx={{
              '& .MuiSlider-markLabel': {
                fontSize: '70%',
              },
            }}
          />
        </Tooltip>
      </TimeSliderContainer>
    </StyledTimeControlPanel>
  );
}

export default TimeControlPanel;
