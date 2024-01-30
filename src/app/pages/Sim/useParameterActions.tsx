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
          draft.country.manufactureShare = manufactureShare;
        },
        commit || false,
        'updateCountry',
      );
    },
    [
      sessionState?.locations,
      sessionState?.edges,
      sessionState?.country,
      setSessionState,
    ],
  );
  const setTransportationCost = useCallback(
    (transportationCost: number, commit?: boolean) => {
      setSessionState(
        (draft) => {
          draft.country.transportationCost = transportationCost;
        },
        commit || false,
        'updateCountry',
      );
    },
    [
      sessionState?.locations,
      sessionState?.edges,
      sessionState?.country,
      ,
      setSessionState,
    ],
  );
  const setElasticitySubstitution = useCallback(
    (elasticitySubstitution: number, commit?: boolean) => {
      setSessionState(
        (draft) => {
          draft.country.elasticitySubstitution = elasticitySubstitution;
        },
        commit || false,
        'updateCountry',
      );
    },
    [
      sessionState?.locations,
      sessionState?.edges,
      sessionState?.country,
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
