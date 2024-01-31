import { ParameterSet } from '../../models/ParameterSet';
import ParameterConfigPanel from '../../components/SessionPanel/ParameterConfigPanel/ParameterConfigPanel';
import React from 'react';
import { ProjectType } from '../../services/database/ProjectType';

export function ParametersPanel({
  type,
  parameterSet,
  onParameterSetChange,
}: {
  type: ProjectType;
  parameterSet: ParameterSet;
  onParameterSetChange: (caseId: string, commit: boolean) => void;
}) {
  return (
    <ParameterConfigPanel
      {...{
        type,
        onParameterSetChange,
      }}
    />
  );
}
