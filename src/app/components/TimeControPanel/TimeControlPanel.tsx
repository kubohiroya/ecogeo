import styled from '@emotion/styled';
import {
  AccessTime,
  PauseCircle,
  PlayCircle,
  RestartAlt,
} from '@mui/icons-material';
import { Button, ButtonGroup, Slider, Tooltip } from '@mui/material';
import React from 'react';
import { TimerAtoms } from '../../store/timer';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';

const StyledTimeControlPanel = styled.div`
  display: flex;
  justify-content: center;
  vertical-align: middle;
  align-content: center;
  align-items: center;
  margin-left: 48px;
  margin-right: 48px;
  gap: 4px;
`;
const StyledButtonGroup = styled(ButtonGroup)``;
const StyledButton = styled(Button)`
  border-radius: 24px;
  padding-left: 25px;
  padding-right: 25px;
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
  width: 60%;
  display: flex;
  gap: 5px;
  align-content: center;
  align-items: center;
  margin: 12px 12px 12px 12px;
`;

/* eslint-disable-next-line */
export interface TimeControlPanelProps {
  timerAtoms: TimerAtoms;
}

const buttonAnimation = (speed: number) => ({
  animation: `blinking ${
    1.1 - speed
  }s ease-in-out infinite alternate; @keyframes blinking { 0% { background-color: #88f;} 100% { background-color: #ccf; }}`,
  color: '#444',
});

export function TimeControlPanel(props: TimeControlPanelProps) {
  const isStarted = useAtomValue(props.timerAtoms.isStartedAtom);
  const onStart = useSetAtom(props.timerAtoms.startAtom);
  const onStop = useSetAtom(props.timerAtoms.stopAtom);
  const onReset = useSetAtom(props.timerAtoms.resetAtom);
  const [speed, setSpeed] = useAtom(props.timerAtoms.speedAtom);
  const [counter, setCounter] = useAtom(props.timerAtoms.counterAtom);

  const incrementCounter = (counter: number) => {
    setCounter(counter + 1);
  };

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
            onClick={() => onStart(incrementCounter)}
            disabled={isStarted}
            startIcon={<PlayCircle />}
          >
            Start
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={onStop}
            disabled={!isStarted}
            sx={{ ...(isStarted ? buttonAnimation(speed) : {}) }}
            startIcon={<PauseCircle />}
          >
            Stop
          </StyledButton>
        </StyledButtonGroup>

        <StyledButton
          onClick={onReset}
          variant="contained"
          color="primary"
          sx={{ ...(isStarted ? buttonAnimation(speed) : {}) }}
          startIcon={<RestartAlt />}
        >
          Reset
        </StyledButton>
      </ButtonPanel>
      <Tooltip title={'Elapsed time'}>
        <TimeCounter>
          <AccessTime />
          <input type={'text'} value={counter} size={6} disabled />
        </TimeCounter>
      </Tooltip>

      <TimeSliderContainer>
        <Tooltip title={'Simulation Speed'}>
          <SpeedSlider
            aria-label={'Simulation speed'}
            value={speed}
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
              setSpeed(newValue as number);
              onStart(incrementCounter);
            }}
            min={0}
            max={1}
            valueLabelDisplay="auto"
            sx={{
              '& .MuiSlider-markLabel': {
                fontSize: '120%',
              },
            }}
          />
        </Tooltip>
      </TimeSliderContainer>
    </StyledTimeControlPanel>
  );
}

export default TimeControlPanel;
