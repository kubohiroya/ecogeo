import React, { ReactNode } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
} from '../../services/database/GeoDatabaseTableType';

type GeoDatabaseTableComponentProps = {
  type: GeoDatabaseTableType;
  items: [ReactNode, ReactNode];
};

const TabPanel = (props: {
  children: ReactNode;
  value: number;
  index: number;
}) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export const GeoDatabaseTableComponent = (
  props: GeoDatabaseTableComponentProps,
) => {
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(newValue === 0 ? '/resources' : '/projects', { replace: true });
  };
  const value = props.type === GeoDatabaseTableTypes.resources ? 0 : 1;
  return (
    <Box>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="tabs"
        >
          <Tab label="Resources" {...a11yProps(0)} />
          <Tab label="Projects" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {props.items[0]}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {props.items[1]}
      </TabPanel>
      <Outlet />
    </Box>
  );
};
