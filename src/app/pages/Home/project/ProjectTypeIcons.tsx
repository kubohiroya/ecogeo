import React, { ReactNode } from 'react';
import { PanoramaFishEye, Public, Share } from '@mui/icons-material';

export const ProjectTypeIcons: Record<string, ReactNode> = {
  RealWorld: <Public />,
  Graph: <Share />,
  Racetrack: <PanoramaFishEye />,
};
