import styled from '@emotion/styled';
import LabelSlider from '../../../../components/LabelSlider/LabelSlider';
import React, {
  forwardRef,
  SyntheticEvent,
  useCallback,
  useImperativeHandle,
} from 'react';
import { Domain, Factory, Favorite, LocalShipping } from '@mui/icons-material';
import { INITIAL_COUNTRY_ARRAY } from '../../../models/initialCountryArray';
import { Country } from '../../../models/Country';

/* eslint-disable-next-line */
export interface CountryConfigPanelProps {
  country: Country;
  setNumLocations: (numLocations: number, commit: boolean) => void;
  setManufactureShare: (manufactureShare: number, commit?: boolean) => void;
  setTransportationCost: (transportationCost: number, commit?: boolean) => void;
  setElasticitySubstitution: (
    elasticitySubstitution: number,
    commit?: boolean
  ) => void;
}

const StyledCountryConfigPanel = styled.div`
  margin-left: 64px;
  margin-right: 64px;
`;

export const CountryConfigPanel = React.memo(
  forwardRef<
    {
      reset: () => void;
    },
    CountryConfigPanelProps
  >((props: CountryConfigPanelProps, ref) => {
    const country = props.country;

    useImperativeHandle(ref, () => ({
      reset() {
        const countryDefault = INITIAL_COUNTRY_ARRAY.find(
          (c) => country.countryId == c.countryId
        );
        props.setNumLocations(countryDefault!.numLocations, true);
        props.setManufactureShare(countryDefault!.manufactureShare);
        props.setTransportationCost(countryDefault!.transportationCost);
        props.setElasticitySubstitution(countryDefault!.elasticitySubstitution);
      },
    }));

    const onNumLocationsChange = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setNumLocations(value as number, false);
      },
      [props.setNumLocations]
    );
    const onNumLocationsChangeCommitted = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setNumLocations(value as number, true);
      },
      [props.setNumLocations]
    );

    const onManufactureShareChanged = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setManufactureShare(value as number, false);
      },
      [props.setManufactureShare]
    );
    const onManufactureShareChangeCommitted = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setManufactureShare(value as number, true);
      },
      [props.setManufactureShare]
    );

    const onTransportationCostChange = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setTransportationCost(value as number, false);
      },
      [props.setTransportationCost]
    );
    const onTransportationCostChangeCommitted = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setTransportationCost(value as number, true);
      },
      [props.setTransportationCost]
    );

    const onElasticitySubstitutionChange = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setElasticitySubstitution(value as number, false);
      },
      [props.setElasticitySubstitution]
    );
    const onElasticitySubstitutionChangeCommitted = useCallback(
      (event: Event | SyntheticEvent, value: number | number[]) => {
        props.setElasticitySubstitution(value as number, true);
      },
      [props.setElasticitySubstitution]
    );

    return (
      <StyledCountryConfigPanel>
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
          value={country.numLocations}
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
          value={country.manufactureShare}
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
          value={country.transportationCost}
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
          value={country.elasticitySubstitution}
          onChange={onElasticitySubstitutionChange}
          onChangeCommitted={onElasticitySubstitutionChangeCommitted}
          min={1}
          max={20}
        />
      </StyledCountryConfigPanel>
    );
  })
);

export default CountryConfigPanel;
