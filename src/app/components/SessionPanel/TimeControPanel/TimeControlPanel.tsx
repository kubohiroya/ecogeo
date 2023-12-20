import styled from "@emotion/styled";
import { AccessTime, PauseCircle, PlayCircle, RestartAlt } from "@mui/icons-material";
import { Button, ButtonGroup, Slider, Tooltip } from "@mui/material";
import React from "react";

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
  isStarted: boolean;
  counter: number;
  intervalScale: number;
  changeIntervalScale: (newValue: number) => void;
  onStart: () => void;
  onReset: () => void;
  onStop: () => void;
}

const buttonAnimation = (speed: number) => ({
  animation: `blinking ${
    1.1 - speed
  }s ease-in-out infinite alternate; @keyframes blinking { 0% { background-color: rgb(35,138,230);} 100% { background-color: rgb(135,188,230); }}`,
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
            onClick={props.onStart}
            disabled={props.isStarted}
            startIcon={<PlayCircle />}
          >
            Start
          </StyledButton>
          <StyledButton
            variant="contained"
            color="primary"
            onClick={props.onStop}
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
          onClick={props.onReset}
          variant="contained"
          color="primary"
          sx={{
            ...(props.isStarted ? buttonAnimation(props.intervalScale) : {},
          }}
          startIcon={<RestartAlt />}
        >
          Reset
        </StyledButton>
      </ButtonPanel>
      <Tooltip title={'Elapsed time'}>
        <TimeCounter>
          <AccessTime />
          <input type="text" value={props.counter} size={6} disabled />
        </TimeCounter>
      </Tooltip>

      <TimeSliderContainer>
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
