import styled from '@emotion/styled';
import { Box, IconButton, Tab, Tooltip, Typography } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';

import React, { useContext, useRef, useState } from 'react';
import CountryParamSliderSet from './CountryParamSliderSet/CountryParamSliderSet';
import { FileDownload, FileUpload, Refresh } from '@mui/icons-material';
import { AppAccordionExpandContext } from '../../../components/AppAccordion/AppAccordion';
import { TabContext, TabList } from '@mui/lab';
import { Country } from '../../model/Country';
import { SessionAtoms } from '../../store/sessions';
import { useAtomValue } from 'jotai';

const StyledTabList = styled(TabList)`
  border-radius: 10px 0 0 10px;
  background-color: #ccc;
  width: 120px;
`;
const StyledTab = styled(Tab)`
  text-transform: none;
  background-color: #eee;
  box-shadow: 3px 2px 3px #aaa;
  border-bottom: 1px solid #aaa;

  &.Mui-selected {
    background-color: #fff;
    border-right: 0 none;
    border-radius: 5px 0 0 5px;
    outline-color: white;
  }

  *[aria-selected='false'] {
    background-color: #ccc;
  }

  button {
    width: 120px !important;
  }
`;

const StyledTabPanel = styled(TabPanel)`
  width: calc(100% - 100px);
  margin: 10px 20px 10px 20px;
`;

const StyledParameterBox = styled.div`
  border-style: solid;
  border-radius: 10px;
  border-width: 1px;
  display: flex;
`;

function a11yProps(id: string) {
  return {
    id: `tab-${id}`,
    'aria-controls': `tabpanel-${id}`,
  };
}

const ControlButton = styled(IconButton)`
  position: absolute;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  border-radius: 20px;
  border: 1px solid gray;
  background-color: white;
`;
const ImportButton = styled(ControlButton)`
  left: 45px;
  bottom: 25px;
  box-shadow: 3px 2px 3px #aaa;
`;
const ExportButton = styled(ControlButton)`
  left: 90px;
  bottom: 25px;
  box-shadow: 3px 2px 3px #aaa;
`;
const ResetButton = styled(ControlButton)`
  left: 160px;
  bottom: 25px;
`;

export interface SessionSelectorPanelProps {
  value: string;
  onChangeCase: (caseId: string) => void;
  sessions: SessionAtoms[];
  onImport: () => void;
  onExport: () => void;
  onReset: () => void;
}

export function SessionSelectorPanel(props: SessionSelectorPanelProps) {
  const expanded = useContext(AppAccordionExpandContext);
  const [value, setValue] = useState<string>(props.value);

  const refs = props.sessions.map(() =>
    useRef<{
      reset: () => void;
    }>(null)
  );

  const onReset = () => {
    const index = countries.findIndex((country, index) => country.id == value);
    refs[index].current?.reset();
  };

  const countries = props.sessions.map((sessionAtom) =>
    useAtomValue(sessionAtom.countryAtom)
  );

  return (
    <StyledParameterBox>
      <TabContext value={value}>
        <StyledTabList
          onChange={(event: React.SyntheticEvent, newValue: string) => {
            setValue(newValue);
            props.onChangeCase(newValue);
          }}
          aria-label="Case selector"
          orientation="vertical"
        >
          {countries.map((country: Country, index: number) => (
            <StyledTab
              key={index}
              value={country.id}
              label={country.title}
              {...a11yProps(country.id)}
            />
          ))}
        </StyledTabList>

        {countries.map((country: Country, index) => (
          <StyledTabPanel key={country.id} value={country.id}>
            <Typography>{country.description}</Typography>
            <CountryParamSliderSet
              ref={refs[index]}
              id={country.id}
              index={index}
              sessionAtoms={props.sessions[index]}
            />
          </StyledTabPanel>
        ))}
      </TabContext>

      {expanded && (
        <Box>
          <Tooltip title={'Import graph structure data from a local file'}>
            <ImportButton
              id="importButton"
              color={'primary'}
              onClick={() => props.onImport()}
            >
              <FileUpload />
            </ImportButton>
          </Tooltip>
          <Tooltip title={'Export graph structure data as a local file'}>
            <ExportButton
              id="exportButton"
              color={'primary'}
              onClick={() => props.onExport()}
            >
              <FileDownload />
            </ExportButton>
          </Tooltip>

          <Tooltip title={'Reset parameters to the case default values'}>
            <ResetButton color={'primary'} onClick={onReset}>
              <Refresh />
            </ResetButton>
          </Tooltip>
        </Box>
      )}
    </StyledParameterBox>
  );
}

export default SessionSelectorPanel;
