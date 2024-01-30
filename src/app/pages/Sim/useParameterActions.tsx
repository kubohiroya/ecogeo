import { SessionState } from '../../models/SessionState';
import { useCallback } from 'react';

const useParameterActions = ({
  sessionState,
  setSessionState,
  onAddBulkLocations,
  onRemoveBulkLocations,
}: {
  sessionState: SessionState;
  setSessionState: (
    func: (draft: SessionState) => void,
    commit: boolean,
    label: string,
  ) => void;
  onAddBulkLocations: (numLocations: number, commit?: boolean) => void;
  onRemoveBulkLocations: (numLocations: number, commit?: boolean) => void;
}) => {
  const setManufactureShare = useCallback(
    (manufactureShare: number, commit?: boolean) => {
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
    (transportationCost: number, commit?: boolean) => {
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
      ,
      setSessionState,
    ],
  );
  const setElasticitySubstitution = useCallback(
    (elasticitySubstitution: number, commit?: boolean) => {
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
        onAddBulkLocations(numLocations, commit);
      } else {
      }
    },
    [],
  );
};
