import { SessionState } from "~/app/models/SessionState";
import { UIState } from "~/app/models/UIState";
import { ChartPane } from "~/app/components/SessionPanel/ChartPane/ChartPane";
import React from "react";
import { ChartCanvas } from "~/app/components/SessionPanel/ChartPane/ChartCanvas";

/*
const VERY_LOW_RANGE = [0, 0.08];
const LOW_RANGE = [0, 0.7];
const HIGH_RANGE = [0.7, Infinity];
export function getPPP(
  w: number,
  h: number,
  data: number[][],
  dimensionality: 'TWOD' | 'WIDTH' | 'HEIGHT',
) {
  // what is TWOD?
  const pixels =
    dimensionality === 'TWOD' ? w * h : dimensionality === 'WIDTH' ? w : h;
  return data.length / pixels;
}

function generateDomain(data: { x: number; y: number }[]) {
  return data.reduce(
    (res, row) => ({
      xMin: Math.min(res.xMin, row.x),
      xMax: Math.max(res.xMax, row.x),
      yMin: Math.min(res.yMin, row.y),
      yMax: Math.max(res.yMax, row.y),
    }),
    { xMin: Infinity, xMax: -Infinity, yMin: Infinity, yMax: -Infinity },
  );
}

export function filterFeatures(
  features: { name: string; min: number; max: number }[],
  ppp: number,
) {
  return features.reduce((res: Record<string, boolean>, feature) => {
    if (ppp < feature.min || ppp > feature.max) {
      return res;
    }
    res[feature.name] = true;
    return res;
  }, {});
}

export const BARCHART_FEATURES = [
  { min: -Infinity, max: Infinity, name: 'xaxis', group: 0 },
  { min: VERY_LOW_RANGE[0], max: VERY_LOW_RANGE[1], name: 'yaxis', group: 1 },
  { min: LOW_RANGE[0], max: LOW_RANGE[1], name: 'bars', group: 2 },
  { min: HIGH_RANGE[0], max: HIGH_RANGE[1], name: 'area', group: 2 },
];

function updateDataForArea(data: number[][], ppp: number) {
  // Use the PPP ratio as the step to sample the data
  const step = Math.round(ppp);
  const sample = [];
  let index = data.length - 1;
  while (index >= 0) {
    const dataPoint = data[index];
    sample.unshift({ ...dataPoint, y: sample.length - 1 });
    index -= step;
  }
  return sample;
}
 */

export const ChartPanelComponent = ({
  sessionState,
  uiState,
  setSessionChartType,
  setSessionChartScale,
  onSelect,
  onUnselect,
  onFocus,
  onUnfocus,
}: {
  sessionState: SessionState;
  uiState: UIState;
  setSessionChartType: (chartTitle: string) => void;
  setSessionChartScale: (scale: number) => void;
  onSelect: (prevSelectedIndices: number[], indices: number[]) => void;
  onUnselect: (prevSelectedIndices: number[], indices: number[]) => void;
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
}) => {
  /*
  function getFeatures() {
    const { height, margin, width } = {
      height: 300,
      margin: 10,
      width: 300,
    };
    const innerWidth = width - margin - margin;
    const innerHeight = height - margin - margin;
    const ppp = getPPP(innerWidth, innerHeight, data, 'HEIGHT');
    return filterFeatures(BARCHART_FEATURES, ppp);
  }

  const data: { x: number; y: number }[] = sessionState.locations.map(
    (city, index) => ({
      x: index,
      y: city.manufactureShare,
    }),
  );

  const yDomain = data.reduce(
    (res, row) => {
      return {
        max: Math.max(res.max, row.y),
        min: Math.min(res.min, row.y),
      };
    },
    { max: -Infinity, min: Infinity },
  );
   */

  // const [yDomain, setYDomain] = React.useState([0, 1]);

  return (
    <ChartPane
      onChangeChartType={setSessionChartType}
      onChangeScale={setSessionChartScale}
      scale={uiState?.chartScale}
      chartType={uiState?.chartType}
    >
      <ChartCanvas
        width={300}
        height={300}
        chartTypeKey={uiState?.chartType}
        scale={uiState?.chartScale}
        locations={sessionState?.locations}
        focusedIndices={uiState?.focusedIndices}
        selectedIndices={uiState?.selectedIndices}
        onFocus={onFocus}
        onUnfocus={onUnfocus}
        onSelect={onSelect}
        onUnselect={onUnselect}
      />
      {/*
      <XYPlot
        margin={{ left: 100, bottom: 80, top: 10, right: 10 }}
        width={300}
        height={300}
        yDomain={[yDomain.min, yDomain.max]}
      >
        <VerticalGridLines />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <VerticalBarSeries barWidth={11} data={data} />
      </XYPlot>
    */}
    </ChartPane>
  );
};
