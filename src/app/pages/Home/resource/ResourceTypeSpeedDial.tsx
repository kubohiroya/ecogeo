import { useNavigate } from 'react-router-dom';
import React from 'react';
import { Flag, Map, LocationCity, Route } from '@mui/icons-material';
import { MapSvgIcon } from '~/components/SvgIcon/MapSvgIcon';
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';

export const ResourceTypeSpeedDial = () => {
  const navigate = useNavigate();

  const speedDialActions = [
    {
      icon: <Map />,
      name: 'MapTile',
      onClick: () => {
        return navigate(`/resources/create/mapTile`);
      },
    },
    {
      icon: <Flag />,
      name: 'GADM GeoJSON',
      onClick: () => {
        return navigate(`/resources/create/gadm`);
      },
    },
    {
      icon: <MapSvgIcon />,
      name: 'GeoJSON',
      onClick: () => {
        return navigate(`/resources/create/geojson`);
      },
    },
    {
      icon: <LocationCity />,
      name: 'IDE-GSM Cities',
      onClick: () => {
        return navigate(`/resources/create/cities`);
      },
    },
    {
      icon: <Route />,
      name: 'IDE-GSM Routes',
      onClick: () => {
        return navigate(`/resources/create/routes`);
      },
    },
  ];

  return (
    <SpeedDial
      style={{ position: 'fixed', bottom: '20px', right: '20px' }}
      direction="up"
      ariaLabel="Create new resource"
      icon={<SpeedDialIcon />}
    >
      {speedDialActions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={action.onClick}
        />
      ))}
    </SpeedDial>
  );
};
