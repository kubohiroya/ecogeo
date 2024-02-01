import { Box, Slider } from '@mui/material';
import styled from '@emotion/styled';

const TimeMachinePanelComponentBox = styled(Box)`
  margin-top: 30px;
  margin-right: 20px;
  margin-left: 20px;
`;

const marks = [
  {
    value: 0,
    label: '0',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 40,
    label: '40',
  },
  {
    value: 60,
    label: '40',
  },
];
export const TimeMachinePanelComponent = () => {
  return (
    <TimeMachinePanelComponentBox>
      <Slider
        defaultValue={0}
        step={1}
        marks={marks}
        min={0}
        max={60}
        valueLabelDisplay="on"
      />
    </TimeMachinePanelComponentBox>
  );
};
