import styled from "@emotion/styled";
import DiagonalMatrix from "../../../components/DiagonalMatrix/DiagonalMatrix";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";

/* eslint-disable-next-line */
export interface DiagonalMatrixSetPanelProps {
  adjacencyData: number[][];
  distanceData: number[][];
  transportationCostData: number[][];
  maxRowColLength: number;
  rgb: {
    r: number;
    g: number;
    b: number;
  };

  onFocus(indices: number[]): void;

  onUnfocus(indices: number[]): void;

  onSelected(indices: number[]): void;
}

const MatricesPanelContainer = styled.div`
  div.focused > div > table > tbody > tr > td:not(.focused) {
    background-color: #e0e0e0 !important;
    color: #333 !important;
  }
`;

const StyledMatricesPanel = styled.div`
  font-size: 75%;
  display: flex;
  gap: 20px;
`;

export interface DiagonalMatrixSetPanelHandle {
  onFocus: (indices: number[]) => void;
  onUnfocus: (indices: number[]) => void;
  onSelect: (indices: number[]) => void;
  onUnselect: (indices: number[]) => void;
}

export const DiagonalMatrixSetPanel = forwardRef<
  DiagonalMatrixSetPanelHandle,
  DiagonalMatrixSetPanelProps
>((props: DiagonalMatrixSetPanelProps, ref) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const refs = [
    useRef<HTMLTableElement | null>(null),
    useRef<HTMLTableElement | null>(null),
    useRef<HTMLTableElement | null>(null),
  ];

  const doFocus = (
    tableRef: HTMLTableElement,
    maxLength: number,
    indices: number[]
  ) => {
    const rows = tableRef.rows!;
    if (indices.length == 1 || (indices[0] != 0 && indices[1] == 0)) {
      for (let i = 0; i < Math.min(rows.length, maxLength + 1); i++) {
        rows[i].cells[indices[0]].classList.add('focused');
        rows[indices[0]].cells[i].classList.add('focused');
      }
    } else if (indices[0] == 0 && indices[1] != 0) {
      for (let i = 0; i < Math.min(rows.length, maxLength + 1); i++) {
        rows[i].cells[indices[1]].classList.add('focused');
        rows[indices[1]].cells[i].classList.add('focused');
      }
    } else if (indices[0] != 0 && indices[1] != 0) {
      for (let i = 0; i < Math.min(rows.length, maxLength + 1); i++) {
        [
          rows[i].cells[indices[0]],
          rows[indices[0]].cells[i],
          rows[i].cells[indices[1]],
          rows[indices[1]].cells[i],
        ].forEach((cell) => cell.classList.add('focused'));
      }
    }
    containerRef.current!.classList.add('focused');
  };

  const doUnfocus = (
    tableRef: HTMLTableElement,
    maxLength: number,
    indices: number[]
  ) => {
    const rows = tableRef.rows!;

    if (indices.length == 1 || (indices[0] != 0 && indices[1] == 0)) {
      for (let i = 0; i < Math.min(rows.length, maxLength + 1); i++) {
        rows[i].cells[indices[0]].classList.remove('focused');
        rows[indices[0]].cells[i].classList.remove('focused');
      }
    } else if (indices[0] == 0 && indices[1] != 0) {
      for (let i = 0; i < Math.min(rows.length, maxLength + 1); i++) {
        rows[i].cells[indices[1]].classList.remove('focused');
        rows[indices[1]].cells[i].classList.remove('focused');
      }
    } else if (indices[0] != 0 && indices[1] != 0) {
      for (let i = 0; i < Math.min(rows.length, maxLength + 1); i++) {
        [
          rows[i].cells[indices[0]],
          rows[indices[0]].cells[i],
          rows[i].cells[indices[1]],
          rows[indices[1]].cells[i],
        ].forEach((cell) => cell.classList.remove('focused'));
      }
    }
    containerRef.current!.classList.remove('focused');
  };

  const doSelect = (
    tableRef: HTMLTableElement,
    maxLength: number,
    indices: number[]
  ) => {
    const rows = tableRef.rows;
    if (rows) {
      indices.forEach((index) => {
        if (index <= maxLength) {
          rows[0].cells[index + 1].classList.add('selected');
          rows[index + 1].cells[0].classList.add('selected');
        }
      });
    }
  };

  const doUnselect = (
    tableRef: HTMLTableElement,
    maxLength: number,
    indices: number[]
  ) => {
    const rows = tableRef.rows;
    if (rows) {
      indices.forEach((index) => {
        if (index <= maxLength) {
          rows[0].cells[index + 1].classList.remove('selected');
          rows[index + 1].cells[0].classList.remove('selected');
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
    doSelectAll(indices);
  };
  const onUnselect = (indices: number[]) => {
    doUnselectAll(indices);
  };

  useImperativeHandle(ref, () => ({
    onFocus,
    onUnfocus,
    onSelect,
    onUnselect,
  }));

  const doFocusAll = (indices: number[], id: string | null) => {
    refs.forEach((tableRef) => {
      const rows = tableRef.current?.rows;
      if (rows) {
        if (indices.length > 1) {
          doFocus(tableRef.current!, props.maxRowColLength, indices);
        } else if (indices.length > 0) {
          doFocus(tableRef.current!, props.maxRowColLength, indices);
        }
      }
      if (id == null || tableRef.current?.id == id) {
        tableRef.current?.classList.add('focused');
      }
    });
  };

  const doUnfocusAll = (indices: number[], id: string | null) => {
    refs.forEach((tableRef) => {
      const rows = tableRef.current?.rows;
      if (rows) {
        if (indices.length > 1) {
          doUnfocus(tableRef.current!, props.maxRowColLength, indices);
        } else if (indices.length > 0) {
          doUnfocus(tableRef.current!, props.maxRowColLength, indices);
        }
      }
      if (id == null || tableRef.current?.id == id)
        tableRef.current?.classList.remove('focused');
    });
  };

  const doSelectAll = (indices: number[]) => {
    refs.forEach((tableRef) => {
      doSelect(tableRef.current!, props.maxRowColLength, indices);
    });
  };

  const doUnselectAll = (indices: number[]) => {
    refs.forEach((tableRef) => {
      doUnselect(tableRef.current!, props.maxRowColLength, indices);
    });
  };

  const onMouseEnter = (id: string | null, indices: number[]) => {
    doFocusAll(indices, id);
    id && props.onFocus(indices.map((index) => index - 1));
  };

  const onMouseLeave = (id: string | null, indices: number[]) => {
    doUnfocusAll(indices, id);
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
      doUnselectAll(intersectionIndices.map((index) => index));
    addingIndices.length > 0 &&
      doSelectAll(addingIndices.map((index) => index));

    setSelectedIndices(xorIndices);
  };

  const onMouseDown = (id: string | null, indices: number[]) => {
    refs.forEach((tableRef) => {
      doMouseDown(tableRef.current!, indices);
    });

    const selectedIndices = indices
      .map((index) => index - 1)
      .filter((index) => 0 <= index);
    id && props.onSelected(selectedIndices);
  };

  return (
    <MatricesPanelContainer>
      <StyledMatricesPanel ref={containerRef}>
        <DiagonalMatrix
          id={'adjacencyMatrix'}
          tableRef={refs[0]}
          title={'Adjacency distances between each pair of locations'}
          maxRowColLength={props.maxRowColLength}
          data={props.adjacencyData}
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
        />

        <DiagonalMatrix
          id={'distanceMatrix'}
          tableRef={refs[1]}
          title={'Distances between each pair of locations'}
          maxRowColLength={props.maxRowColLength}
          data={props.distanceData}
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
        />

        <DiagonalMatrix
          id={'transportationCostMatrix'}
          tableRef={refs[2]}
          title={'Transportation costs between each pair of locations'}
          maxRowColLength={props.maxRowColLength}
          data={props.transportationCostData}
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
        />
      </StyledMatricesPanel>
    </MatricesPanelContainer>
  );
});

export default DiagonalMatrixSetPanel;
