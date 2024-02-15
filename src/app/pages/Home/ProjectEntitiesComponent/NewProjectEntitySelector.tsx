import { GeoDatabaseEntityCreateModeSelector } from "~/app/pages/Home/GeoDatabaseEntityCreateModeSelector";
import { GeoDatabaseTableTypes } from "~/app/models/GeoDatabaseTableType";
import React, { useState } from "react";
import { Close, PanoramaFishEye, Public, Share } from "@mui/icons-material";
import { ProjectTypes } from "~/app/models/ProjectType";
import { Dialog, IconButton } from "@mui/material";
import { Link } from "react-router-dom";

export function NewProjectEntitySelector() {
  const [open, setOpen] = useState(true);
  return (
    <Dialog open={open} hideBackdrop={false} onClick={() => setOpen(false)}>
      <GeoDatabaseEntityCreateModeSelector
        type={GeoDatabaseTableTypes.projects}
        items={[
          {
            icon: <PanoramaFishEye fontSize="large" />,
            name: 'Racetrack Model',
            url: `/projects/create/${ProjectTypes.Racetrack}`,
            tooltip: "Paul Krugman's spatial economy model",
          },
          {
            icon: <Share fontSize="large" />,
            name: 'Graph Structured Model',
            url: `/projects/create/${ProjectTypes.Racetrack}`,
            tooltip: 'Graph structured spatial economy model',
          },
          {
            icon: <Public fontSize="large" />,
            name: 'Real-World Model',
            url: `/projects/create/${ProjectTypes.RealWorld}`,
            tooltip: 'Full-set simulation model',
          },
        ]}
      />
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <Link to="/projects">
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
