import styled from '@emotion/styled';
import React, { ForwardedRef, ReactNode } from 'react';
import { isInfinity, round } from '../../app/utils/mathUtil';
import { Box, CircularProgress } from '@mui/material';
import { City } from '../../app/models/City';

/* eslint-disable-next-line */
export interface MatrixProps {
  matrixId: string;
  icon: ReactNode;
  title: string;
  locations: City[];
  data: number[][] | null;
  maxRowColLength: number;
  fractionDigits?: number;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  focused: boolean;
  focusedIndices: number[];
  selectedIndices: number[];
  onMouseEnter: (
    matrixId: string,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onMouseLeave: (
    matrixId: string,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  onMouseDown: (
    matrixId: string,
    rowIndex: number,
    columnIndex: number,
  ) => void;
  tableRef: ForwardedRef<HTMLTableElement>;
}

const MatrixContainer = styled.div`
  color: black;
  width: 33%;
`;

const HeaderWithIcon = styled.h3`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 0;
  margin-bottom: 10px;
`;

const TableContainer = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  border: 0 solid black;
  text-align: center;
  box-shadow: 1px 1px 1px 3px #ccc inset;
  max-height: 40vh;

  th,
  td {
    border: 0 solid white;
    cursor: pointer;
  }

  th {
    background-color: #e0e0e0;

    position: sticky;
    left: 0;
    top: 0; /* Don't forget this, required for the stickiness */
    box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.4);
  }

  th.selected,
  td.selected {
    border: 0 solid #e0e0e0 !important;
  }

  .selected.focused {
    color: red;
  }

  th.focused,
  td.focused {
    color: rgba(100, 100, 0, 1);
  }

  tr:first-of-type > th.selected,
  tr > th:first-of-type.selected {
    border: 0 solid yellow !important;
    background-color: #dd1 !important;
  }

  tr:first-of-type > th.focused,
  tr > th:first-of-type.focused {
    background-color: rgb(255, 255, 0, 1) !important;
  }

  tr:first-of-type > th.focused.selected,
  tr > th:first-of-type.focused.selected {
    background-color: #ff0 !important;
  }
`;

const StyledBox = styled(Box)`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function valueToStyle(
  rgb: {
    r: number;
    g: number;
    b: number;
  },
  value: number,
  max: number,
  focused: boolean,
  selected: boolean,
) {
  if (isInfinity(value)) {
    if (selected) {
      if (focused) {
        return {
          style: {
            backgroundColor: `#eee`,
            color: '#ff3333',
          },
          valueString: '♾️️',
        };
      } else {
        return {
          style: {
            backgroundColor: `#ccc`,
            color: '#ff3333',
          },
          valueString: '♾️️',
        };
      }
    } else {
      return {
        style: {
          backgroundColor: '#bbb',
          color: '#ccc',
        },
        valueString: '♾️',
      };
    }
  } else if (value === 0.0) {
    if (selected) {
      return {
        style: {
          backgroundColor: `#ddd`,
          color: '#833',
        },
        valueString: round(value, 0.01),
      };
    } else {
      return {
        style: {
          backgroundColor: '#888',
          color: '#ccc',
        },
        valueString: round(value, 0.01),
      };
    }
  } else {
    if (selected) {
      return {
        style: {
          backgroundColor: `rgba(${rgb.r},${rgb.g},${rgb.b},${value / max})`,
          color: '#f33',
        },
        valueString: round(value, 0.01),
      };
    } else {
      return {
        style: {
          backgroundColor: `rgba(${rgb.r * 0.9},${rgb.g * 0.9},${rgb.b * 0.9},${
            value / max
          })`,
          color: '#ccc',
        },
        valueString: round(value, 0.01),
      };
    }
  }
}

const onMouseEnter = (
  matrixId: string,
  maxLength: number,
  rowIndex: number,
  columnIndex: number,
  onMouseEnterCallback: (
    matrixId: string,
    rowIndex: number,
    columnIndex: number,
  ) => void,
) => {
  if (columnIndex - 1 === maxLength || rowIndex - 1 === maxLength) return;
  onMouseEnterCallback(matrixId, rowIndex, columnIndex);
};

const onMouseLeave = (
  matrixId: string,
  maxLength: number,
  rowIndex: number,
  columnIndex: number,
  onMouseLeaveCallback: (
    matrixId: string,
    rowIndex: number,
    columnIndex: number,
  ) => void,
) => {
  if (columnIndex - 1 === maxLength || rowIndex - 1 === maxLength) return;
  onMouseLeaveCallback(matrixId, rowIndex, columnIndex);
};

const onMouseDown = (
  matrixId: string,
  maxLength: number,
  rowIndex: number,
  columnIndex: number,
  onMouseDownCallback: (
    matrixId: string,
    rowIndex: number,
    columnIndex: number,
  ) => void,
) => {
  if (columnIndex - 1 === maxLength || rowIndex - 1 === maxLength) return;
  onMouseDownCallback(matrixId, rowIndex, columnIndex);
};

export const DiagonalMatrix = (props: MatrixProps) => {
  const valueMax: number =
    (props.data &&
      props.data.reduce(
        (prev, curr) =>
          Math.max(prev, ...curr.filter((value) => !isInfinity(value))),
        0,
      )) ||
    0;

  function getClassName(indices: number[]) {
    return [
      indices.some((index) => props.focusedIndices.includes(index))
        ? 'focused'
        : '',
      indices.some((index) => props.selectedIndices.includes(index))
        ? 'selected'
        : '',
    ]
      .filter((value) => value !== '')
      .join(' ');
  }

  return (
    <MatrixContainer>
      <HeaderWithIcon>
        {props.icon}
        {props.title}
      </HeaderWithIcon>
      {props.data === null ? (
        <StyledBox>
          <CircularProgress />
        </StyledBox>
      ) : (
        <TableContainer>
          <Box className="fog-added">
            <StyledTable
              id={props.matrixId}
              className={props.focused ? 'focused' : ''}
              ref={props.tableRef}
            >
              <thead>
                <tr>
                  <th></th>
                  {props.data
                    .filter(
                      (values, rowIndex) => rowIndex <= props.maxRowColLength,
                    )
                    .map(
                      (values, index) =>
                        props.locations[index] && (
                          <th
                            key={index}
                            title={props.locations[index].label}
                            onMouseEnter={() =>
                              onMouseEnter(
                                props.matrixId,
                                props.maxRowColLength,
                                0,
                                index + 1,
                                props.onMouseEnter,
                              )
                            }
                            onMouseLeave={() =>
                              onMouseLeave(
                                props.matrixId,
                                props.maxRowColLength,
                                0,
                                index + 1,
                                props.onMouseLeave,
                              )
                            }
                            onMouseDown={() =>
                              onMouseDown(
                                props.matrixId,
                                props.maxRowColLength,
                                0,
                                index + 1,
                                props.onMouseDown,
                              )
                            }
                            className={getClassName([index])}
                          >
                            {index === props.maxRowColLength ? '...' : index}
                          </th>
                        ),
                    )}
                </tr>
              </thead>
              <tbody>
                {props.data
                  .filter((value, index) => index <= props.maxRowColLength)
                  .map(
                    (values, rowIndex) =>
                      props.locations[rowIndex] && (
                        <tr
                          title={props.locations[rowIndex].label}
                          key={rowIndex}
                        >
                          <th
                            onMouseEnter={() =>
                              onMouseEnter(
                                props.matrixId,
                                props.maxRowColLength,
                                rowIndex + 1,
                                0,
                                props.onMouseEnter,
                              )
                            }
                            onMouseLeave={() =>
                              onMouseLeave(
                                props.matrixId,
                                props.maxRowColLength,
                                rowIndex + 1,
                                0,
                                props.onMouseLeave,
                              )
                            }
                            onMouseDown={() =>
                              onMouseLeave(
                                props.matrixId,
                                props.maxRowColLength,
                                rowIndex + 1,
                                0,
                                props.onMouseDown,
                              )
                            }
                            className={getClassName([rowIndex])}
                          >
                            {rowIndex === props.maxRowColLength
                              ? '...'
                              : rowIndex}
                          </th>
                          {values
                            .filter(
                              (value, index) => index <= props.maxRowColLength,
                            )
                            .map((value, columnIndex) => {
                              const { style, valueString } =
                                rowIndex == props.maxRowColLength ||
                                columnIndex == props.maxRowColLength
                                  ? { style: {}, valueString: '...' }
                                  : valueToStyle(
                                      props.rgb,
                                      value,
                                      valueMax,
                                      [columnIndex, rowIndex].some((index) =>
                                        props.focusedIndices.includes(index),
                                      ),
                                      [columnIndex, rowIndex].some((index) =>
                                        props.selectedIndices.includes(index),
                                      ),
                                    );

                              return (
                                <td
                                  key={columnIndex + 1}
                                  title={`(${columnIndex}, ${rowIndex}) = ${valueString}`}
                                  onMouseEnter={() =>
                                    onMouseEnter(
                                      props.matrixId,
                                      props.maxRowColLength,
                                      rowIndex + 1,
                                      columnIndex + 1,
                                      props.onMouseEnter,
                                    )
                                  }
                                  onMouseLeave={() =>
                                    onMouseLeave(
                                      props.matrixId,
                                      props.maxRowColLength,
                                      rowIndex + 1,
                                      columnIndex + 1,
                                      props.onMouseLeave,
                                    )
                                  }
                                  onMouseDown={() =>
                                    onMouseDown(
                                      props.matrixId,
                                      props.maxRowColLength,
                                      rowIndex + 1,
                                      columnIndex + 1,
                                      props.onMouseDown,
                                    )
                                  }
                                  className={
                                    rowIndex < props.maxRowColLength
                                      ? getClassName([rowIndex, columnIndex])
                                      : ''
                                  }
                                  style={style}
                                >
                                  {valueString}
                                </td>
                              );
                            })}
                        </tr>
                      ),
                  )}
              </tbody>
            </StyledTable>
          </Box>
        </TableContainer>
      )}
    </MatrixContainer>
  );
};

export default DiagonalMatrix;
