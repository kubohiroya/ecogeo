import { Country } from '../../models/Country';
import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Tune } from '@mui/icons-material';
import ParameterConfigPanel from '../../components/SessionPanel/ParameterConfigPanel/ParameterConfigPanel';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function setNumLocations(numLocations: number) {
  // FIXME!
}

export function setManufactureShare(manufactureShare: number) {
  // FIXME!
}

export function setTransportationCost(transportationCost: number) {
  // FIXME!
}

export function setElasticitySubstitution(elasticitySubstitution: number) {
  // FIXME!
}

export function setCountry(country: string) {
  // FIXME!
}

export function createParameterPanel({
  country,
}: {
  country: Country;
}): GridItem {
  return {
    layout: {
      i: 'Parameters',
      x: 1,
      y: 3,
      w: 9,
      h: 9,
      minW: 9,
      minH: 9,
      isDraggable: true,
      isResizable: true,
      resizeHandles: ['se'],
    },
    resource: {
      id: 'Parameters',
      type: GridItemType.FloatingPanel,
      title: 'Parameters',
      icon: <Tune />,
      titleBarMode: 'win',
      rowHeight: ROW_HEIGHT,
      shown: true,
      bindToButtonId: 'ParametersButton',
      children: (
        <ParameterConfigPanel
          country={country}
          setNumLocations={setNumLocations}
          setManufactureShare={setManufactureShare}
          setTransportationCost={setTransportationCost}
          setElasticitySubstitution={setElasticitySubstitution}
          setCountry={setCountry}
        />
      ),
    },
  };
}
