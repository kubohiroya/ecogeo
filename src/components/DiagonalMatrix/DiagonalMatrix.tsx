import styled from "@emotion/styled";
import React, { ForwardedRef, useState } from "react";

/* eslint-disable-next-line */
export interface MatrixProps {
  id: string;
  title: string;
  data: number[][];
  maxRowColLength: number;
  fractionDigits?: number;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  onMouseEnter: (id: string, rowIndex: number, columnIndex: number) => void;
  onMouseLeave: (id: string, rowIndex: number, columnIndex: number) => void;
  onMouseDown: (id: string, rowIndex: number, columnIndex: number) => void;
  tableRef: ForwardedRef<HTMLTableElement>;
}

const MatrixContainer = styled.div`
  color: black;
  width: 33%;
`;

const HeaderWithIcon = styled.h3`
  display: flex;
  gap: 10px;
  align-content: center;
  align-items: center;
  margin-top: 0;
  margin-bottom: 10px;
`;
const StyledTable = styled.table`
  border-collapse: collapse;
  border: 1px solid black;
  text-align: center;
  width: 100%;

  th,
  td {
    border: 1px solid white;
    cursor: pointer;
  }

  th {
    background-color: #e0e0e0;
  }

  th.focused,
  td.focused {
  }

  th.selected,
  td.selected {
    border: 1px solid #e0e0e0 !important;
  }

  .selected.focused {
    color: red;
  }

  tr:first-of-type > th.selected,
  tr > th:first-of-type.selected {
    border: 1px solid yellow !important;
    background-color: #dd1 !important;
  }

  tr:first-of-type > th.focused,
  tr > th:first-of-type.focused {
    background-color: rgb(255, 255, 0, 0.3) !important;
  }

  tr:first-of-type > th.focused.selected,
  tr > th:first-of-type.focused.selected {
    background-color: #ff0 !important;
  }
`;

function valueToString(value: number, fractionDigits = 2) {
  return value == Number.POSITIVE_INFINITY
    ? '♾️'
    : value.toFixed(fractionDigits).toString();
}

function valueToStyle(
  rgb: {
    r: number;
    g: number;
    b: number;
  },
  a: number
) {
  const backgroundColor = {
    backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${
      a == Number.POSITIVE_INFINITY ? 0 : a
    })`,
  };
  return a == Number.POSITIVE_INFINITY
    ? {}
    : a < 0.5
    ? { style: { ...backgroundColor } }
    : { style: { ...backgroundColor, color: '#ddd' } };
}

const onMouseEnter = (
  id: string,
  maxLength: number,
  rowIndex: number,
  columnIndex: number,
  onMouseEnterCallback: (
    id: string,
    rowIndex: number,
    columnIndex: number
  ) => void
) => {
  if (columnIndex - 1 == maxLength || rowIndex - 1 == maxLength) return;
  onMouseEnterCallback(id, rowIndex, columnIndex);
};

const onMouseLeave = (
  id: string,
  maxLength: number,
  rowIndex: number,
  columnIndex: number,
  onMouseLeaveCallback: (
    id: string,
    rowIndex: number,
    columnIndex: number
  ) => void
) => {
  if (columnIndex - 1 == maxLength || rowIndex - 1 == maxLength) return;
  onMouseLeaveCallback(id, rowIndex, columnIndex);
};

const onMouseDown = (
  id: string,
  maxLength: number,
  rowIndex: number,
  columnIndex: number,
  onMouseDownCallback: (
    id: string,
    rowIndex: number,
    columnIndex: number
  ) => void
) => {
  if (columnIndex - 1 == maxLength || rowIndex - 1 == maxLength) return;
  onMouseDownCallback(id, rowIndex, columnIndex);
};

export const DiagonalMatrix = (props: MatrixProps) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const valueMax: number = props.data.reduce(
    (prev, curr) =>
      Math.max(
        prev,
        ...curr.filter((value) => value != Number.POSITIVE_INFINITY)
      ),
    0
  );

  return (
    <MatrixContainer>
      <HeaderWithIcon>{props.title}</HeaderWithIcon>
      <StyledTable id={props.id} ref={props.tableRef}>
        <thead>
          <tr>
            <th></th>
            {props.data
              .filter((values, rowIndex) => rowIndex <= props.maxRowColLength)
              .map((values, index) => (
                <th
                  key={index + 1}
                  title={`${index}`}
                  onMouseEnter={() =>
                    onMouseEnter(
                      props.id,
                      props.maxRowColLength,
                      0,
                      index + 1,
                      props.onMouseEnter
                    )
                  }
                  onMouseLeave={() =>
                    onMouseLeave(
                      props.id,
                      props.maxRowColLength,
                      0,
                      index + 1,
                      props.onMouseLeave
                    )
                  }
                  onMouseDown={() =>
                    onMouseDown(
                      props.id,
                      props.maxRowColLength,
                      0,
                      index + 1,
                      props.onMouseDown
                    )
                  }
                  className={selectedIds.includes(index) ? 'selected' : ''}
                >
                  {index == props.maxRowColLength ? '...' : index}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {props.data
            .filter((value, index) => index <= props.maxRowColLength)
            .map((values, rowIndex) => (
              <tr title={`${rowIndex}`} key={rowIndex + 1}>
                <th
                  onMouseEnter={() =>
                    onMouseEnter(
                      props.id,
                      props.maxRowColLength,
                      rowIndex + 1,
                      0,
                      props.onMouseEnter
                    )
                  }
                  onMouseLeave={() =>
                    onMouseLeave(
                      props.id,
                      props.maxRowColLength,
                      rowIndex + 1,
                      0,
                      props.onMouseLeave
                    )
                  }
                  onMouseDown={() =>
                    onMouseLeave(
                      props.id,
                      props.maxRowColLength,
                      rowIndex + 1,
                      0,
                      props.onMouseDown
                    )
                  }
                  className={selectedIds.includes(rowIndex) ? 'selected' : ''}
                >
                  {rowIndex == props.maxRowColLength ? '...' : rowIndex}
                </th>
                {values
                  .filter((value, index) => index <= props.maxRowColLength)
                  .map((value, columnIndex) => {
                    const v =
                      rowIndex == props.maxRowColLength ||
                      columnIndex == props.maxRowColLength
                        ? '...'
                        : valueToString(value, props.fractionDigits);
                    return (
                      <td
                        key={columnIndex + 1}
                        title={`(${columnIndex}, ${rowIndex}) = ${v}`}
                        onMouseEnter={() =>
                          onMouseEnter(
                            props.id,
                            props.maxRowColLength,
                            rowIndex + 1,
                            columnIndex + 1,
                            props.onMouseEnter
                          )
                        }
                        onMouseLeave={() =>
                          onMouseLeave(
                            props.id,
                            props.maxRowColLength,
                            rowIndex + 1,
                            columnIndex + 1,
                            props.onMouseLeave
                          )
                        }
                        onMouseDown={() =>
                          onMouseDown(
                            props.id,
                            props.maxRowColLength,
                            rowIndex + 1,
                            columnIndex + 1,
                            props.onMouseDown
                          )
                        }
                        {...(rowIndex == props.maxRowColLength ||
                        columnIndex == props.maxRowColLength
                          ? {}
                          : valueToStyle(props.rgb, value / valueMax))}
                        className={
                          rowIndex < props.maxRowColLength - 1 &&
                          (selectedIds.includes(rowIndex) ||
                            selectedIds.includes(columnIndex))
                            ? 'selected'
                            : ''
                        }
                      >
                        {v}
                      </td>
                    );
                  })}
              </tr>
            ))}
        </tbody>
      </StyledTable>
    </MatrixContainer>
  );
};

export default DiagonalMatrix;
