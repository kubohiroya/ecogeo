import { SessionState } from '~/app/models/SessionState';
import { useCallback } from 'react';
import { DEFAULT_PARAMS_BY_CASE } from '~/app/models/DefaultParamByCase';
import { ProjectType } from '~/app/models/ProjectType';

export const useParameterActions = ({
  type,
  sessionState,
  setSessionState,
  onAddBulkLocations,
  onRemoveBulkLocations,
}: {
  type: ProjectType;
  sessionState: SessionState;
  setSessionState: (
    func: (draft: SessionState) => void,
    commit: boolean,
    label: string,
  ) => void;
  onAddBulkLocations: (numLocations: number, commit?: boolean) => void;
  onRemoveBulkLocations: (numLocations: number, commit?: boolean) => void;
}) => {
  const onCaseChange = useCallback(
    (caseId: string) => {
      setSessionState(
        (sessionState) => {
          sessionState.parameterSet =
            DEFAULT_PARAMS_BY_CASE[type].find(
              (item) => item.caseId === caseId,
            ) || sessionState.parameterSet;
          return sessionState;
        },
        true,
        'changeCase',
      );
    },
    [setSessionState],
  );
  const setManufactureShare = useCallback(
    (manufactureShare: number, commit: boolean) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.manufactureShare = manufactureShare;
        },
        commit || false,
        'updateCountry',
      );
    },
    [
      sessionState?.locations,
      sessionState?.edges,
      sessionState?.parameterSet,
      setSessionState,
    ],
  );
  const setTransportationCost = useCallback(
    (transportationCost: number, commit: boolean) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.transportationCost = transportationCost;
        },
        commit || false,
        'updateCountry',
      );
    },
    [
      sessionState?.locations,
      sessionState?.edges,
      sessionState?.parameterSet,
      setSessionState,
    ],
  );
  const setElasticitySubstitution = useCallback(
    (elasticitySubstitution: number, commit: boolean) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.elasticitySubstitution = elasticitySubstitution;
        },
        commit || false,
        'updateCountry',
      );
    },
    [
      sessionState?.locations,
      sessionState?.edges,
      sessionState?.parameterSet,
      setSessionState,
    ],
  );

  const setNumLocations = useCallback(
    (numLocations: number, commit: boolean) => {
      if (numLocations < sessionState.locations.length) {
        onRemoveBulkLocations(numLocations, commit);
      } else if (sessionState.locations.length < numLocations) {
        console.log('onAddBulkLocations', numLocations);
        onAddBulkLocations(numLocations, commit);
      }
    },
    [],
  );
  return {
    onParameterSetChange: onCaseChange,
    setManufactureShare,
    setTransportationCost,
    setElasticitySubstitution,
    setNumLocations,
  };
};
