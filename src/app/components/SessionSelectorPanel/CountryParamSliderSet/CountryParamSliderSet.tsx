import styled from "@emotion/styled";
import LabelSlider from "../../../../components/LabelSlider/LabelSlider";
import React, { forwardRef, useImperativeHandle } from "react";
import { Domain, Factory, Favorite, LocalShipping } from "@mui/icons-material";
import { useAtom } from "jotai";
import { Country } from "../../../model/Country";
import { SessionAtoms } from "../../../store/sessions";
import { countryDefaults } from "../../../store/countryDefaults";

/* eslint-disable-next-line */
export interface CountryParamSliderSetProps {
  id: string;
  index: number;
  sessionAtoms: SessionAtoms;
}

const StyledParamSliderSet = styled.div`
  margin-left: 64px;
  margin-right: 64px;
`;

export const CountryParamSliderSet = forwardRef<
  {
    reset: () => void;
  },
  CountryParamSliderSetProps
>((props: CountryParamSliderSetProps, ref) => {
  const [country, setCountry] = useAtom<Country>(
    props.sessionAtoms.countryAtom
  );

  const [numLocations, setNumLocations] = useAtom(
    props.sessionAtoms.numLocationsAtom
  );

  const [shareManufacturing, setShareManufacturing] = useAtom(
    props.sessionAtoms.shareManufacturingAtom
  );
  const [transportationCost, setTransportationCost] = useAtom(
    props.sessionAtoms.transportationCostAtom
  );
  const [elasticitySubstitution, setElasticitySubstitution] = useAtom(
    props.sessionAtoms.elasticitySubstitutionAtom
  );

  // refを使って親コンポーネントからリセットを可能にする
  useImperativeHandle(ref, () => ({
    reset() {
      const countryDefault = countryDefaults[props.index];
      setNumLocations(countryDefault.numLocations);
      setShareManufacturing(countryDefault.shareManufacturing);
      setTransportationCost(countryDefault.transportationCost);
      setElasticitySubstitution(countryDefault.elasticitySubstitution);
    },
  }));

  return (
    <StyledParamSliderSet>
      <LabelSlider
        title={'K: The number of regions connected by transportation network.'}
        icon={<Domain />}
        label={'K'}
        step={1}
        marks={[
          { value: 0, label: '0' },
          { value: 20, label: '20' },
          { value: 40, label: '40' },
          { value: 60, label: '60' },
          { value: 80, label: '80' },
          { value: 100, label: '100' },
        ]}
        value={numLocations}
        onChange={(event: Event, value: number | number[]) => {
          setNumLocations(value as number);
        }}
        min={0}
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
        value={shareManufacturing}
        onChange={(event: Event, value: number | number[]) => {
          setShareManufacturing(value as number);
        }}
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
        value={transportationCost}
        onChange={(event: Event, value: number | number[]) => {
          setTransportationCost(value as number);
        }}
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
        value={elasticitySubstitution}
        onChange={(event: Event, value: number | number[]) => {
          setElasticitySubstitution(value as number);
        }}
        min={1}
        max={20}
      />
    </StyledParamSliderSet>
  );
});

export default CountryParamSliderSet;
