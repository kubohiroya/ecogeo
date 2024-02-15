import ParameterConfigPanel from "~/app/components/SessionPanel/ParameterConfigPanel/ParameterConfigPanel";
import React from "react";
import { ProjectType } from "~/app/models/ProjectType";

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
