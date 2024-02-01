import ParameterConfigPanel from '../../../components/SessionPanel/ParameterConfigPanel/ParameterConfigPanel';
import React from 'react';
import { ProjectType } from '../../../services/database/ProjectType';

export function ParametersPanelComponent({
  type,
  onParameterSetChange,
}: {
  type: ProjectType;
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
