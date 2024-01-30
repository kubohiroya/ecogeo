import { ParameterSet } from '../../models/ParameterSet';
import { GridItem } from '../../models/GridItem';
import { GridItemType } from '../../models/GridItemType';
import { Tune } from '@mui/icons-material';
import ParameterConfigPanel from '../../components/SessionPanel/ParameterConfigPanel/ParameterConfigPanel';
import React from 'react';
import { ROW_HEIGHT } from './RaceTrackDesktopComponent';

export function createParameterPanel({
  parameterSet,
  setNumLocations,
  setManufactureShare,
  setTransportationCost,
  setElasticitySubstitution,
  onParameterSetChanged,
}: {
  parameterSet: ParameterSet;
  setNumLocations: (numLocations: number) => void;
  setManufactureShare: (manufactureShare: number) => void;
  setTransportationCost: (transportationCost: number) => void;
  setElasticitySubstitution: (elasticitySubstitution: number) => void;
  onParameterSetChanged: (caseId: string) => void;
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
          parameterSet={parameterSet}
          setNumLocations={setNumLocations}
          setManufactureShare={setManufactureShare}
          setTransportationCost={setTransportationCost}
          setElasticitySubstitution={setElasticitySubstitution}
          onParameterSetChanged={onParameterSetChanged}
        />
      ),
    },
  };
}
