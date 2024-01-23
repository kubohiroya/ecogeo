import styled from '@emotion/styled';
import DiagonalMatrix from '../../../../components/DiagonalMatrix/DiagonalMatrix';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { Box } from '@mui/material';
import { City } from '../../../models/City';

/* eslint-disable-next-line */
export interface DiagonalMatrixSetPanelProps {
  locations: City[];
  adjacencyMatrix: number[][] | null;
  distanceMatrix: number[][] | null;
  transportationCostMatrix: number[][] | null;

  maxRowColLength: number;
  rgb: {
    r: number;
    g: number;
    b: number;
  };

  selectedIndices: number[];
  focusedIndices: number[];

  onFocus(indices: number[]): void;

  onUnfocus(indices: number[]): void;

  onSelected(prevSelectedIndices: number[], indices: number[]): void;
}

const MatricesPanelContainer = styled.div`
  div.focused > div > table > tbody > tr > td:not(.focused) {
    background-color: #e0e0e0 !important;
    color: #333;
  }
`;

const StyledMatricesPanel = styled(Box)`
  font-size: 75%;
  display: flex;
  gap: 20px;
`;

export interface DiagonalMatrixSetPanelHandle {
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onSelect: (prevIndices: number[], indices: number[]) => void;
  onUnselect: (indices: number[]) => void;
}

export const MatrixSetPanel = forwardRef<
  DiagonalMatrixSetPanelHandle,
  DiagonalMatrixSetPanelProps
>((props: DiagonalMatrixSetPanelProps, ref) => {
  const [focusedTableId, setFocusedTableId] = useState<string | null>(null);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const refs = [
    useRef<HTMLTableElement | null>(null),
    useRef<HTMLTableElement | null>(null),
    useRef<HTMLTableElement | null>(null),
  ];

  const doSelect = (
    tableRef: HTMLTableElement | null,
    maxLength: number,
    indices: number[],
  ) => {
    if (tableRef && tableRef.rows) {
      indices.forEach((index) => {
        if (index <= maxLength) {
          tableRef.rows[0].cells[index + 1]?.classList.add('selected');
          tableRef.rows[index + 1]?.cells[0]?.classList.add('selected');
        }
      });
    }
  };

  const doUnselect = (
    tableRef: HTMLTableElement | null,
    maxLength: number,
    indices: number[],
  ) => {
    if (tableRef && tableRef.rows) {
      indices.forEach((index) => {
        if (index <= maxLength) {
          tableRef.rows[0].cells[index + 1]?.classList.remove('selected');
          tableRef.rows[index + 1]?.cells[0]?.classList.remove('selected');
        }
      });
    }
  };

  const onFocus = (indices: number[]) => {
    onMouseEnter(null, indices);
  };
  const onUnfocus = (indices: number[]) => {
    onMouseLeave(null, indices);
  };
  const onSelect = (indices: number[]) => {
    dispatchSelectEventToAllTables(indices);
  };
  const onUnselect = (indices: number[]) => {
    dispatchUnselectEventToAllTables(indices);
  };

  useImperativeHandle(ref, () => ({
    onFocus,
    onUnfocus,
    onSelect,
    onUnselect,
  }));

  const dispatchSelectEventToAllTables = (indices: number[]) => {
    refs.forEach((tableRef) => {
      doSelect(tableRef.current, props.maxRowColLength, indices);
    });
  };

  const dispatchUnselectEventToAllTables = (indices: number[]) => {
    refs.forEach((tableRef) => {
      doUnselect(tableRef.current, props.maxRowColLength, indices);
    });
  };

  const onMouseEnter = (id: string | null, indices: number[]) => {
    setFocusedTableId(id);
    id && props.onFocus(indices.map((index) => index - 1));
  };

  const onMouseLeave = (id: string | null, indices: number[]) => {
    setFocusedTableId(null);
    id && props.onUnfocus(indices.map((index) => index - 1));
  };

  const doMouseDown = (tableRef: HTMLTableElement, indices: number[]) => {
    const rows = tableRef.rows!;

    const arr1 = selectedIndices;
    const arr2 = indices
      .map((index) => index - 1)
      .filter((index) => index >= 0);
    const set2 = new Set(arr2);

    const intersectionIndices = arr1.filter((item) => set2.has(item));
    const intersectionIndicesSet = new Set(intersectionIndices);

    const remainingIndices = arr1.filter((x) => !intersectionIndicesSet.has(x));
    const addingIndices = arr2.filter((x) => !intersectionIndicesSet.has(x));

    const xorIndices = remainingIndices.concat(addingIndices);

    intersectionIndices.length > 0 &&
      dispatchUnselectEventToAllTables(
        intersectionIndices.map((index) => index),
      );
    addingIndices.length > 0 &&
      dispatchSelectEventToAllTables(addingIndices.map((index) => index));

    setSelectedIndices(xorIndices);
  };

  const onMouseDown = (id: string | null, indices: number[]) => {
    refs.forEach((tableRef) => {
      doMouseDown(tableRef.current!, indices);
    });

    const newSelectedIndices = indices
      .map((index) => index - 1)
      .filter((index) => 0 <= index);
    id && props.onSelected(selectedIndices, newSelectedIndices);
  };

  return (
    <MatricesPanelContainer>
      <StyledMatricesPanel
        className={props.focusedIndices?.length > 0 ? 'focused' : ''}
      >
        <DiagonalMatrix
          matrixId={'adjacencyMatrix'}
          locations={props.locations}
          focused={focusedTableId == 'adjacencyMatrix'}
          tableRef={refs[0]}
          title={'Adjacency distances between each pair of locations'}
          maxRowColLength={props.maxRowColLength}
          data={props.adjacencyMatrix}
          rgb={props.rgb}
          onMouseEnter={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseEnter(id, [rowIndex, columnIndex])
          }
          onMouseLeave={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseLeave(id, [rowIndex, columnIndex])
          }
          onMouseDown={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseDown(id, [rowIndex, columnIndex])
          }
          focusedIndices={props.focusedIndices}
          selectedIndices={props.selectedIndices}
        />

        <DiagonalMatrix
          matrixId={'distanceMatrix'}
          locations={props.locations}
          focused={focusedTableId == 'distanceMatrix'}
          tableRef={refs[1]}
          title={'Path distances between each pair of locations'}
          maxRowColLength={props.maxRowColLength}
          data={props.distanceMatrix}
          rgb={props.rgb}
          onMouseEnter={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseEnter(id, [rowIndex, columnIndex])
          }
          onMouseLeave={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseLeave(id, [rowIndex, columnIndex])
          }
          onMouseDown={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseDown(id, [rowIndex, columnIndex])
          }
          focusedIndices={props.focusedIndices}
          selectedIndices={props.selectedIndices}
        />

        <DiagonalMatrix
          matrixId={'transportationCostMatrix'}
          locations={props.locations}
          focused={focusedTableId == 'transportationCostMatrix'}
          tableRef={refs[2]}
          title={'Transportation costs between each pair of locations'}
          maxRowColLength={props.maxRowColLength}
          data={props.transportationCostMatrix}
          rgb={props.rgb}
          onMouseEnter={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseEnter(id, [rowIndex, columnIndex])
          }
          onMouseLeave={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseLeave(id, [rowIndex, columnIndex])
          }
          onMouseDown={(id: string, rowIndex: number, columnIndex: number) =>
            onMouseDown(id, [rowIndex, columnIndex])
          }
          focusedIndices={props.focusedIndices}
          selectedIndices={props.selectedIndices}
        />
      </StyledMatricesPanel>
    </MatricesPanelContainer>
  );
});

export default MatrixSetPanel;
