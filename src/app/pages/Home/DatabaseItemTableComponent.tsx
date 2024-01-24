import React from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { Outlet, useNavigate } from 'react-router-dom';
import { ResourceItemsComponent } from '../ResourceItemsComponent/ResourceItemsComponent';
import { ProjectItemsComponent } from '../ProjectItemsComponent/ProjectItemsComponent';

type DatabaseItemIndexPros = {
  mode: number;
};

const TabPanel = (props: any) => {
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

export const DatabaseItemTableComponent = (props: DatabaseItemIndexPros) => {
  const navigate = useNavigate();
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(newValue == 0 ? '/resources' : '/projects', { replace: true });
  };

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
          value={props.mode}
          onChange={handleChange}
          aria-label="tabs"
        >
          <Tab label="Resources" {...a11yProps(0)} />
          <Tab label="Projects" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={props.mode} index={0}>
        <ResourceItemsComponent />
      </TabPanel>
      <TabPanel value={props.mode} index={1}>
        <ProjectItemsComponent />
      </TabPanel>
      <Outlet />
    </Box>
  );
};
