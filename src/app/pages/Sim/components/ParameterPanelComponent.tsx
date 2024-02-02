import ParameterConfigPanel from '../../../components/SessionPanel/ParameterConfigPanel/ParameterConfigPanel';
import React from 'react';
import { ProjectType } from '../../../services/database/ProjectType';

export function ParametersPanelComponent({
  type,
  onParameterSetChange,
  setNumLocations,
}: {
  type: ProjectType;
  onParameterSetChange: (caseId: string, commit: boolean) => void;
  setNumLocations: (numLocations: number, commit: boolean) => void;
}) {
  return (
    <ParameterConfigPanel
      {...{
        type,
        onParameterSetChange,
        setNumLocations,
      }}
    />
  );
}
