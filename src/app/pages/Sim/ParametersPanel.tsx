import { ParameterSet } from '../../models/ParameterSet';
import ParameterConfigPanel from '../../components/SessionPanel/ParameterConfigPanel/ParameterConfigPanel';
import React from 'react';

export function ParametersPanel({
  parameterSet,
  setNumLocations,
  setManufactureShare,
  setTransportationCost,
  setElasticitySubstitution,
  onParameterSetChange,
}: {
  parameterSet: ParameterSet;
  setNumLocations: (numLocations: number, commit: boolean) => void;
  setManufactureShare: (manufactureShare: number, commit: boolean) => void;
  setTransportationCost: (transportationCost: number, commit: boolean) => void;
  setElasticitySubstitution: (
    elasticitySubstitution: number,
    commit: boolean,
  ) => void;
  onParameterSetChange: (caseId: string, commit: boolean) => void;
}) {
  return (
    <ParameterConfigPanel
      {...{
        parameterSet,
        setNumLocations,
        setManufactureShare,
        setTransportationCost,
        setElasticitySubstitution,
        onParameterSetChange,
      }}
    />
  );
}
