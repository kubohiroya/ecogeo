import styled from "@emotion/styled";

import React, { useEffect, useMemo, useRef, useState } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import TimeControlPanel from "./components/TimeControPanel/TimeControlPanel";
import { Box, LinearProgress } from "@mui/material";
import GraphPanel from "./components/GraphPanel/GraphPanel";
import ChartPanel from "./components/ChartPanel/ChartPanel";
import { GridOn, LinearScale, Share } from "@mui/icons-material";
import GithubCorner from "react-github-corner";
import SessionSelectorPanel from "./components/SessionSelectorPanel/SessionSelectorPanel";
import AppHeader from "../components/AppHeader/AppHeader";
import AppAccordion from "../components/AppAccordion/AppAccordion";
import { arrayXOR } from "./util/arrayUtil";
import ReferenceSection from "./components/ReferenceSection/ReferenceSection";
import DiagonalMatrixSetPanel, {
  DiagonalMatrixSetPanelHandle
} from "./components/DiagonalMatrixSetPanel/DiagonalMatrixSetPanel";
import { DiagonalMatrixSetAccordionSummaryTitle } from "./DiagonalMatrixSetAccordionSummaryTitle";
import { CaseSelectorAccordionSummaryTitle } from "./caseSelectorAccordionSummaryTitle";
import { countryDefaults } from "./store/countryDefaults";
import { ChartCanvas } from "./components/ChartPanel/ChartCanvas";
import { ChartTypes } from "./type/ChartTypes";
import { sessionAtomsArrayAtom } from "./store/sessions";
import { useAtom, useAtomValue } from "jotai";
import { ResizableDelta, Rnd } from "react-rnd";
import { GraphCanvas } from "./graph/GraphCanvas";

const StyledApp = styled.div`
  h1 {
    text-align: center;
    margin-top: 8px;
    margin-bottom: 2px;
  }
`;

const GraphAndChartContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-content: center;
  border-radius: 0 0 8px 8px;
  gap: 2px;
  padding: 0;
  margin-bottom: 3px;
  overflow: scroll;
  background-color: #ccc;
  box-shadow: 3px 3px 0 0 #bbb inset;
`;

const ResizableStyled = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'solid 1px #ddd',
  background: '#f8f8f8',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  margin: '3px 3px 3px 3px',
  borderRadius: '8px',
};

export function App() {
  const containerRef = useRef<null | HTMLDivElement>(null);
  const graphContainerRef = useRef<null | Rnd>(null);
  const chartContainerRef = useRef<null | Rnd>(null);
  const diagonalMatrixSetPanelRef = useRef<DiagonalMatrixSetPanelHandle>(null);

  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    countryDefaults[0].id
  );

  const sessionAtomsArray = useAtomValue(sessionAtomsArrayAtom);
  const sessionAtoms = sessionAtomsArray.find(
    (session) => session.id === selectedCaseId
  );

  const containerHeight = 500;

  const [graphCanvasX, setGraphCanvasX] = useState<number>(0);
  const [graphCanvasY, setGraphCanvasY] = useState<number>(0);
  const [chartCanvasX, setChartCanvasX] = useState<number>(containerHeight);
  const [chartCanvasY, setChartCanvasY] = useState<number>(0);
  const [graphCanvasWidth, setGraphCanvasWidth] =
    useState<number>(containerHeight);
  const [graphCanvasHeight, setGraphCanvasHeight] =
    useState<number>(containerHeight);
  const [chartCanvasWidth, setChartCanvasWidth] =
    useState<number>(containerHeight);
  const [chartCanvasHeight, setChartCanvasHeight] =
    useState<number>(containerHeight);

  useEffect(() => {
    document.title ="GEO-ECO: Geological Economics Modeling Simulator"';

    const handleResizeEvent = () => {
      if (
        containerRef.current &&
        graphContainerRef.current &&
        chartContainerRef.current
      ) {
        const left = containerRef.current.offsetLeft;
        const top = containerRef.current.offsetTop;
        const width = containerRef.current.offsetWidth;
        const height = containerRef.current.clientHeight;

        const size = 400;
        const horizMargin = 10;
        const graphTopMargin = 2;
        const chartTopMargin = 2;
        const leftMargin = 2;
        const graphBottomMargin = 5;
        const chartBottomMargin = 5;

        setGraphCanvasX(leftMargin);
        setGraphCanvasY(graphTopMargin);

        setChartCanvasX(width - size - leftMargin);
        setChartCanvasY(chartTopMargin);

        setGraphCanvasWidth(width - size - horizMargin);
        setGraphCanvasHeight(height - graphBottomMargin);
        setChartCanvasWidth(size);
        setChartCanvasHeight(height - chartBottomMargin);
      }
    };

    window.addEventListener"load"', handleResizeEvent);
    window.addEventListener"resize"', handleResizeEvent);
  });

  const onResizeStop = (id: string, delta: ResizableDelta) => {
    const d = id ==="graphContainer"' ? -1 : 1;
    setGraphCanvasWidth(graphCanvasWidth - delta.width * d);
    setChartCanvasWidth(chartCanvasWidth + delta.width * d);
    const newHeight = Math.max(graphCanvasHeight, chartCanvasHeight);
    setGraphCanvasHeight(newHeight);

    setChartCanvasX(chartCanvasX - delta.width * d);
  };

  const [chartType, setChartType] = useState(ChartTypes.ShareOfManufacturing);
  const [
    expandedCaseSelectorPanelAccordion,
    setExpandedCaseSelectorPanelAccordio,
  ] = useState<boolean>(false);
  const [
    expandedDiagonalMatrixSetPanelAccordion,
    setExpandedDiagonalMatrixSetPanelAccordio,
  ] = useState<boolean>(true);

  const [
    lockDiagonalMatrixSetPanelAccordion,
    setLockDiagonalMatrixSetPanelAccordio,
  ] = useState<boolean>(false);

  if (!sessionAtoms) {
    throw new Error"session is null"');
  }

  const isStarted = useAtomValue(sessionAtoms.timerAtoms.isStartedAtom);

  const locations = useAtomValue(sessionAtoms.locationsAtom);
  const [focusedIds, setFocusedIds] = useAtom(sessionAtoms.focusedIdsAtom);
  const [selectedIds, setSelectedIds] = useAtom(sessionAtoms.selectedIdsAtom);
  const [chartScale, setChartScale] = useAtom(sessionAtoms.chartScaleAtom);
  const [maxRowColLength, setMaxRowColLength] = useAtom(
    sessionAtoms.maxRowColLengthAtom
  );
  const adjacencyMatrix = useAtomValue(sessionAtoms.adjacencyMatrixAtom);
  const [distanceMatrix, predecessorMatrix] = useAtomValue(
    sessionAtoms.distancePredecessorMatrixAtom
  );
  const transportationCostMatrix = useAtomValue(
    sessionAtoms.transportationCostMatrixAtom
  );

  const onFocus = (indices: number[]) => {
    const newFocusedIds = indices.filter((value) => value != -1);
    diagonalMatrixSetPanelRef.current?.onFocus(
      indices.map((index) => index + 1)
    );
    setFocusedIds(newFocusedIds);
    return focusedIds.includes(indices[0]);
  };

  const onUnfocus = (indices: number[]) => {
    const newUnfocusedIds = focusedIds.filter((nodeId) =>
      indices.includes(nodeId)
    );
    diagonalMatrixSetPanelRef.current?.onUnfocus(
      newUnfocusedIds.map((index) => index + 1)
    );
    const newFocusedIds = focusedIds.filter(
      (nodeId) => !indices.includes(nodeId)
    );
    setFocusedIds(newFocusedIds);
  };

  const onSelect = (indices: number[]) => {
    const newSelectedNodeIds = arrayXOR(selectedIds, indices).sort();
    diagonalMatrixSetPanelRef.current?.onSelect(newSelectedNodeIds);
    //diagonalMatrixSetPanelRef.current?.onUnselect(newUnselectedNodeIds)
    setSelectedIds(newSelectedNodeIds);
  };

  const onUnselect = (indices: number[]) => {
    const newSelectedNodeIds = selectedIds.filter(
      (index) => !indices.includes(index)
    );
    diagonalMatrixSetPanelRef.current?.onUnselect(indices);
    setSelectedIds(newSelectedNodeIds);
  };

  /*
  const onResizeChartContainer: ResizeCallback = (
    event,
    direction,
    refToElement,
    dalta
  ) => {
    // console.log(refToElement.clientWidth, refToElement.clientHeight)
    setCanvasWidth(refToElement.clientWidth);
    setCanvasHeight(refToElement.clientHeight);
  };

        width={graphCanvasWidth}
        height={graphCanvasHeight}
        focusedIds={focusedIds}
        selectedIds={selectedIds}

   */

  const GraphCanvasMemo = useMemo(() => {
    return (
      <GraphCanvas
        locations={locations}
        onFocus={onFocus}
        onUnfocus={onUnfocus}
        onSelect={onSelect}
        onUnselect={onUnselect}
      />
    );
  }, [graphCanvasWidth, graphCanvasHeight, locations]);

  return (
    <StyledApp>
      <AppHeader startIcon={<Share fontSize={"large"} />}>
        Graph Structured Economy Model
      </AppHeader>
      <GithubCorner
        href="https://github.com/kubohiroya/racetrack-economy-model"
        size={64}
      />
      {isStarted ? (
        <LinearProgress color="primary" />
      ) : (
        <Box sx={{ height: "4px" }} />
      )}

      <GraphAndChartContainer
        ref={containerRef}
        style={{ width: "100%", height: containerHeight + "px" }}
      >
        <Rnd
          id={"graphContainer"}
          ref={graphContainerRef}
          style={ResizableStyled}
          dragAxis={"none"}
          disableDragging={true}
          size={{ width: graphCanvasWidth, height: graphCanvasHeight }}
          position={{ x: graphCanvasX, y: graphCanvasY }}
          onResizeStop={(e, dir, refToElement, delta) =>
            onResizeStop("graphContainer", delta)
          }
        >
          <GraphPanel
            hideGraphEditButtons={isStarted}
            disableGraphEditButtons={isStarted}
          >
            {GraphCanvasMemo}
          </GraphPanel>
        </Rnd>

        <Rnd
          id={"chartContainer"}
          ref={chartContainerRef}
          style={ResizableStyled}
          dragAxis={"none"}
          disableDragging={true}
          size={{ width: chartCanvasWidth, height: chartCanvasHeight }}
          position={{ x: chartCanvasX, y: chartCanvasY }}
          onResizeStop={(e, dir, refToElement, delta) =>
            onResizeStop("chartContainer", delta)
          }
        >
          <ChartPanel
            onChangeChartType={(type) => setChartType(type as ChartTypes)}
            onChangeScale={(scale) => setChartScale(scale)}
            scale={chartScale}
            chartType={chartType}
          >
            <ChartCanvas
              width={chartCanvasWidth}
              height={chartCanvasHeight}
              chartTypeKey={chartType}
              scale={chartScale}
              locations={locations}
              focusedIds={focusedIds}
              selectedIds={selectedIds}
              onFocus={onFocus}
              onUnfocus={onUnfocus}
              onSelect={onSelect}
              onUnselect={onUnselect}
            />
          </ChartPanel>
        </Rnd>
      </GraphAndChartContainer>

      <Box sx={{ margin: "0 2px 0 2px" }}>
        <AppAccordion
          expanded={expandedCaseSelectorPanelAccordion}
          onClickSummary={() =>
            setExpandedCaseSelectorPanelAccordion(
              !expandedCaseSelectorPanelAccordion
            )
          }
          summaryAriaControl="parameter-control-panel-content"
          summaryIcon={<LinearScale />}
          summaryTitle={
            <CaseSelectorAccordionSummaryTitle
              selectedCaseId={selectedCaseId}
            />
          }
        >
          <SessionSelectorPanel
            value={"0000"}
            onChangeCase={(caseId: string) => setSelectedCaseId(caseId)}
            sessions={sessionAtomsArray}
            onImport={() => console.log("onImport")}
            onExport={() => console.log("onExport")}
            onReset={() => console.log("reset")}
          />
        </AppAccordion>

        <AppAccordion
          expanded={expandedDiagonalMatrixSetPanelAccordion}
          onClickSummary={() =>
            setExpandedDiagonalMatrixSetPanelAccordion(
              !expandedDiagonalMatrixSetPanelAccordion
            )
          }
          lock={lockDiagonalMatrixSetPanelAccordion}
          summaryAriaControl="matrices-panel-content"
          summaryIcon={<GridOn />}
          summaryTitle={
            <DiagonalMatrixSetAccordionSummaryTitle
              selectedNodeIds={selectedIds}
              focusedNodeIds={focusedIds}
              doUnselectNode={onUnselect}
              onFocus={onFocus}
              onUnfocus={onUnfocus}
              setLockDiagonalMatrixSetPanelAccordion={
                setLockDiagonalMatrixSetPanelAccordion
              }
            />
          }
        >
          <DiagonalMatrixSetPanel
            ref={diagonalMatrixSetPanelRef}
            maxRowColLength={maxRowColLength}
            adjacencyData={adjacencyMatrix}
            distanceData={distanceMatrix}
            transportationCostData={transportationCostMatrix}
            rgb={{ r: 0, g: 0, b: 255 }}
            onSelected={onSelect}
            onFocus={onFocus}
            onUnfocus={onUnfocus}
          />
        </AppAccordion>

        <TimeControlPanel timerAtoms={sessionAtoms.timerAtoms} />
      </Box>

      <ReferenceSection />
    </StyledApp>
  );
}

export default App;
