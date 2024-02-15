import styled from "@emotion/styled";
import LabelSlider from "src/components/LabelSlider/LabelSlider";
import React, { forwardRef, SyntheticEvent, useCallback, useImperativeHandle } from "react";
import { Domain, Factory, Favorite, LocalShipping } from "@mui/icons-material";
import { DEFAULT_PARAMS_BY_CASE } from "~/app/models/DefaultParamByCase";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useUndoRedo } from "~/app/hooks/useUndoRedo";
import { SessionState } from "~/app/models/SessionState";
import { ProjectType } from "~/app/models/ProjectType";
import { ParameterSet } from "~/app/models/ParameterSet";
import { sessionStateAtom } from "~/app/pages/Sim/SimLoader";

/* eslint-disable-next-line */
export interface ParameterConfigPanelProps {
  type: ProjectType;
  onParameterSetChange: (caseId: string, commit: boolean) => void;
  setNumLocations: (numLocations: number, commit: boolean) => void;
}

const StyledParameterConfigPanel = styled.div`
  margin-left: 0;
  margin-right: 10px;
`;

export const ParameterConfigPanel = forwardRef<
  {
    resetToDefault: () => void;
  },
  ParameterConfigPanelProps
>((props: ParameterConfigPanelProps, ref) => {
  const { set: setSessionState, current: sessionState } =
    useUndoRedo<SessionState>(sessionStateAtom);

  useImperativeHandle(ref, () => ({
    resetToDefault() {
      const caseDefault = (
        DEFAULT_PARAMS_BY_CASE[props.type] as ParameterSet[]
      ).find((c) => sessionState.parameterSet.caseId === c.caseId);
      setSessionState(
        (draft) => {
          draft.parameterSet.numLocations = caseDefault!.numLocations;
          draft.parameterSet.manufactureShare = caseDefault!.manufactureShare;
          draft.parameterSet.transportationCost =
            caseDefault!.transportationCost;
          draft.parameterSet.elasticitySubstitution =
            caseDefault!.elasticitySubstitution;
        },
        true,
        'resetToDefault',
      );
    },
  }));

  const cases = DEFAULT_PARAMS_BY_CASE[props.type];

  const onNumLocationsChange = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      props.setNumLocations(value as number, false);
      /*
      setSessionState(
        (draft) => {
          draft.parameterSet.numLocations = value as number;
        },
        false,
        'set parameter',
      );
       */
    },
    [setSessionState],
  );
  const onNumLocationsChangeCommitted = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      props.setNumLocations(value as number, true);
      /*
      setSessionState(
        (draft) => {
          draft.parameterSet.numLocations = value as number;
        },
        true,
        'set parameter',
      );
       */
    },
    [setSessionState],
  );

  const onManufactureShareChanged = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.manufactureShare = value as number;
        },
        false,
        'set parameter',
      );
    },
    [setSessionState],
  );
  const onManufactureShareChangeCommitted = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.manufactureShare = value as number;
        },
        true,
        'set parameter',
      );
    },
    [setSessionState],
  );

  const onTransportationCostChange = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.transportationCost = value as number;
        },
        false,
        'set parameter',
      );
    },
    [setSessionState],
  );
  const onTransportationCostChangeCommitted = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.transportationCost = value as number;
        },
        true,
        'set parameter',
      );
    },
    [setSessionState],
  );

  const onElasticitySubstitutionChange = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.elasticitySubstitution = value as number;
        },
        false,
        'set parameter',
      );
    },
    [setSessionState],
  );
  const onElasticitySubstitutionChangeCommitted = useCallback(
    (event: Event | SyntheticEvent, value: number | number[]) => {
      setSessionState(
        (draft) => {
          draft.parameterSet.elasticitySubstitution = value as number;
        },
        true,
        'set parameter',
      );
    },
    [setSessionState],
  );

  return (
    <StyledParameterConfigPanel>
      <ToggleButtonGroup
        exclusive
        value={sessionState.parameterSet.caseId}
        onChange={(
          event: React.MouseEvent<HTMLElement>,
          caseId: string | null,
        ) => {
          caseId !== null && props.onParameterSetChange(caseId, true);
        }}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '4px',
          marginBottom: '8px',
        }}
      >
        {cases.map((c, index) => (
          <ToggleButton
            size="small"
            key={index}
            title={c.title + ': ' + c.description}
            value={c.caseId}
          >
            {c.title}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      <LabelSlider
        title={
          'K: The number of locations connected by transportation network.'
        }
        icon={<Domain />}
        label={'K'}
        step={1}
        marks={[
          { value: 1, label: '1' },
          { value: 20, label: '20' },
          { value: 40, label: '40' },
          { value: 60, label: '60' },
          { value: 80, label: '80' },
          { value: 100, label: '100' },
        ]}
        value={sessionState.parameterSet.numLocations || 0}
        onChange={onNumLocationsChange}
        onChangeCommitted={onNumLocationsChangeCommitted}
        min={1}
        max={100}
      />
      <LabelSlider
        title={'π: The share of manufacturing goods in expenditure.'}
        icon={<Factory />}
        label={'π'}
        step={0.01}
        marks={[
          { value: 0, label: '0' },
          { value: 0.2, label: '0.2' },
          { value: 0.4, label: '0.4' },
          { value: 0.6, label: '0.6' },
          { value: 0.8, label: '0.8' },
          { value: 1.0, label: '1.0' },
        ]}
        value={sessionState.parameterSet.manufactureShare || 0}
        onChange={onManufactureShareChanged}
        onChangeCommitted={onManufactureShareChangeCommitted}
        min={0}
        max={1.0}
      />
      <LabelSlider
        title={
          'τ: The level of transportation cost among locations. A value of 1 represents no transportation cost, while a value of 10 represents significant transportation cost.'
        }
        icon={<LocalShipping />}
        label={'τ'}
        step={0.1}
        marks={[
          { value: 1, label: '1' },
          { value: 4, label: '4' },
          { value: 7, label: '7' },
          { value: 10, label: '10' },
        ]}
        value={sessionState.parameterSet.transportationCost || 0}
        onChange={onTransportationCostChange}
        onChangeCommitted={onTransportationCostChangeCommitted}
        min={1}
        max={10}
      />

      <LabelSlider
        title={
          'σ: The elasticity of substitution among manufactured goods. A value of 1 represents a strong love of variety, while a value of 20 represents a limited love of variety.'
        }
        icon={<Favorite />}
        label={'σ'}
        step={0.1}
        marks={[
          { value: 1, label: '1' },
          { value: 5, label: '5' },
          { value: 10, label: '10' },
          { value: 15, label: '15' },
          { value: 20, label: '20' },
        ]}
        value={sessionState.parameterSet.elasticitySubstitution || 0}
        onChange={onElasticitySubstitutionChange}
        onChangeCommitted={onElasticitySubstitutionChangeCommitted}
        min={1}
        max={20}
      />
    </StyledParameterConfigPanel>
  );
});

export default ParameterConfigPanel;
