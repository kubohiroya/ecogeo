import { SimLoaderResult } from './SimLoader';
import { useLoaderData } from 'react-router-dom';
import { ProjectTypes } from '../../services/database/ProjectType';
import React from 'react';
import { GraphSimPage } from './gridItems/GraphSimPage';
import { RealWorldSimPage } from './RealWorldSimPage';
import { RaceTrackSimPage } from './RaceTrackSimPage';

export const SimPage = () => {
  const { type } = useLoaderData() as SimLoaderResult;
  switch (type) {
    case ProjectTypes.Racetrack:
      return <RaceTrackSimPage />;
    case ProjectTypes.Graph:
      return <GraphSimPage />;
    case ProjectTypes.RealWorld:
      return <RealWorldSimPage />;
    default:
      throw new Error(type);
  }
};
