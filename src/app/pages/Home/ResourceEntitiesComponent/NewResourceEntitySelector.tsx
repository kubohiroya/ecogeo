import { GeoDatabaseEntityCreateModeSelector } from "../../Home/GeoDatabaseEntityCreateModeSelector";
import { Close, Flag, LocationCity, Route } from "@mui/icons-material";
import React, { useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { GeoDatabaseTableTypes } from "~/app/models/GeoDatabaseTableType";
import { MapSvgIcon } from "~/components/SvgIcon/MapSvgIcon";

export function NewResourceEntitySelector() {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} hideBackdrop={false} onClick={() => setOpen(false)}>
      <GeoDatabaseEntityCreateModeSelector
        type={GeoDatabaseTableTypes.resources}
        items={[
          {
            icon: <Flag fontSize="large" />,
            name: 'GADM GeoJSON',
            url: `/resources/create/gadm`,
            tooltip:
              'GADM Country(Level 0), division(Level 1) and subdivision(Level 2,3) shape files',
          },
          {
            icon: <MapSvgIcon fontSize="large" />,
            name: 'Generic GeoJSON',
            url: `/resources/create/geojson`,
            tooltip: 'Generic GeoJSON files',
          },
          {
            icon: <LocationCity fontSize="large" />,
            name: 'IDE-GSM Cities',
            url: `/resources/create/cities`,
            tooltip:
              'IDE-GSM data file includes city information, GDP, population, etc.',
          },
          {
            icon: <Route fontSize="large" />,
            name: 'IDE-GSM Routes',
            url: `/resources/create/routes`,
            tooltip:
              'IDE-GSM data file includes route information, start, end, distance, etc.',
          },
        ]}
      />
      <Link to="/resources">
        <IconButton
          size="large"
          sx={{
            position: 'absolute',
            top: '4px',
            right: '4px',
          }}
        >
          <Close style={{ width: '40px', height: '40px' }} />
        </IconButton>
      </Link>
    </Dialog>
  );
}
