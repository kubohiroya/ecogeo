import {
  Box,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { memo, useCallback } from 'react';
import { loop } from '~/app/utils/arrayUtil';
import styled from '@emotion/styled';
import {
  Domain,
  Flag,
  LocationCity,
  Villa,
  VillaOutlined,
} from '@mui/icons-material';
import { GADMGeoJsonCountryMetadata } from '~/app/models/GADMGeoJsonCountryMetadata';
import { createGADMCountryUrl, createGADMRegionUrl } from './CreateGADMUrl';
import { produce } from 'immer';

const SelectorTable = styled(Table)`
  & > tbody > tr > td {
    background-color: rgba(245, 245, 245);
  }
`;

interface GADMResourceSelectorProps {
  readonly countryMetadataList: GADMGeoJsonCountryMetadata[];
  readonly levelMax: number;
  readonly checkboxMatrix: boolean[][];
  onChange: (draft: boolean[][]) => void;
}

export const GADMGeoJsonSelector = memo(
  ({
    levelMax,
    countryMetadataList,
    checkboxMatrix,
    onChange,
  }: GADMResourceSelectorProps) => {
    const LEVELS = loop(levelMax);

    const isIndeterminateColumn = useCallback(
      (columnIndex: number) => {
        let numCell = 0;
        let numTrue = 0;
        let numFalse = 0;
        for (let rowIndex = 1; rowIndex < checkboxMatrix.length; rowIndex++) {
          if (columnIndex < checkboxMatrix[rowIndex].length) {
            numCell++;
            if (checkboxMatrix[rowIndex][columnIndex]) {
              numTrue++;
            } else {
              numFalse++;
            }
            if (numCell === numTrue || numCell === numFalse) {
              continue;
            }
            return true;
          }
        }
        return false;
      },
      [checkboxMatrix],
    );

    // 行のチェック状態を集計する関数
    const isIndeterminateRow = useCallback(
      (rowIndex: number) => {
        let numTrue = 0;
        let numFalse = 0;
        const maxLevel = checkboxMatrix[rowIndex].length - 1;
        for (let level = 0; level < maxLevel; level++) {
          if (checkboxMatrix[rowIndex][level + 1]) {
            numTrue++;
          } else {
            numFalse++;
          }
        }
        const result = !(
          (numTrue === maxLevel && numFalse === 0) ||
          (numFalse === maxLevel && numTrue === 0)
        );
        // console.log(rowIndex, maxLevel, numTrue, numFalse, result);
        return result;
      },
      [checkboxMatrix],
    );

    // チェックボックスの状態を更新する関数
    const handleCheckboxChange = useCallback(
      (rowIndex: number, columnIndex: number) => {
        onChange(
          produce(checkboxMatrix, (draft: boolean[][]) => {
            draft[rowIndex][columnIndex] = !draft[rowIndex][columnIndex];
          }),
        );
      },
      [checkboxMatrix],
    );

    // 行見出しまたは列見出しのチェックボックスを更新する関数
    const handleRowHeaderCheckboxChange = useCallback(
      (rowIndex: number) => {
        onChange(
          produce(checkboxMatrix, (draft: boolean[][]) => {
            const newValue = !draft[rowIndex][0];
            draft[rowIndex][0] = newValue;
            for (
              let columnIndex = 1;
              columnIndex < draft[rowIndex].length;
              columnIndex++
            ) {
              draft[rowIndex][columnIndex] = newValue;
            }
          }),
        );
      },
      [checkboxMatrix],
    );

    const handleColumnHeaderCheckboxChange = useCallback(
      (columnIndex: number) => {
        onChange(
          produce(checkboxMatrix, (draft: boolean[][]) => {
            const newValue = !draft[0][columnIndex];
            draft[0][columnIndex] = newValue;
            for (let rowIndex = 1; rowIndex < draft.length; rowIndex++) {
              if (columnIndex < draft[rowIndex].length) {
                draft[rowIndex][columnIndex] = newValue;
              }
            }
          }),
        );
      },
      [checkboxMatrix],
    );

    const handleAllCheckboxChange = useCallback(() => {
      onChange(
        produce(checkboxMatrix, (draft: boolean[][]) => {
          const newValue = !draft[0][0];
          for (let rowIndex = 0; rowIndex < draft.length; rowIndex++) {
            for (
              let columnIndex = 0;
              columnIndex < draft[rowIndex].length;
              columnIndex++
            ) {
              draft[rowIndex][columnIndex] = newValue;
            }
          }
          return draft;
        }),
      );
    }, [checkboxMatrix]);

    // テーブルの見出し行のチェックボックスをレンダリングする関数
    const renderHeaderCheckboxes = useCallback(() => {
      return (
        Object.keys(checkboxMatrix).length > 0 && (
          <>
            <TableCell key="-1" component="th" scope="row">
              <Checkbox
                checked={checkboxMatrix[0][0]}
                indeterminate={checkboxMatrix[0][0] === undefined}
                onChange={handleAllCheckboxChange}
                name={'all'}
              />
              <Typography sx={{ fontStyle: 'bold' }}>
                Select/Unselect All
              </Typography>
            </TableCell>
            {LEVELS.map((level) => (
              <TableCell key={level} component="th" scope="row">
                <Checkbox
                  checked={checkboxMatrix[0][level + 1]}
                  indeterminate={isIndeterminateColumn(level + 1)}
                  onChange={() => handleColumnHeaderCheckboxChange(level + 1)}
                  name={`${level}`}
                />
                <Tooltip
                  title={`Level ${level}: ${level === 0 ? 'Country' : level === 1 ? 'Division' : level === 2 ? 'Subdivision' : level === 3 ? 'Subsubdivision' : ''}`}
                >
                  <Typography sx={{ fontStyle: 'bold' }}>
                    {level === 0 ? (
                      <Flag />
                    ) : level === 1 ? (
                      <LocationCity />
                    ) : level === 2 ? (
                      <Domain />
                    ) : level === 3 ? (
                      <Villa />
                    ) : level === 4 ? (
                      <VillaOutlined />
                    ) : (
                      ''
                    )}
                    Level {level}
                  </Typography>
                </Tooltip>
              </TableCell>
            ))}
          </>
        )
      );
    }, [checkboxMatrix]);

    // テーブルの各行をレンダリングする関数
    const renderRows = useCallback(() => {
      return (
        checkboxMatrix.length > 0 &&
        countryMetadataList.map((item, dataIndex) => (
          <TableRow key={dataIndex}>
            <TableCell component="th" scope="row">
              <Checkbox
                checked={checkboxMatrix[dataIndex + 1][0]}
                indeterminate={isIndeterminateRow(dataIndex + 1)}
                onChange={() => handleRowHeaderCheckboxChange(dataIndex + 1)}
                name={`${dataIndex + 1}`}
              />
              <a
                href={`https://gadm.org/maps/${item.countryCode}.html`}
                target="_blank"
                rel="noreferrer"
              >
                {item.countryName}({item.countryCode})
              </a>
            </TableCell>
            {LEVELS.map((level: number) => (
              <TableCell key={level}>
                {level <= item.maxLevel && (
                  <>
                    <Checkbox
                      checked={checkboxMatrix[dataIndex + 1][level + 1]}
                      onChange={() =>
                        handleCheckboxChange(dataIndex + 1, level + 1)
                      }
                      name={`${dataIndex + 1}_${level + 1}`}
                    />
                    {level === 0 && (
                      <a
                        href={createGADMCountryUrl(item.countryCode)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {level}
                      </a>
                    )}
                    {level === 1 && (
                      <a
                        href={createGADMRegionUrl(item.countryCode, level)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {level}
                      </a>
                    )}
                  </>
                )}
              </TableCell>
            ))}
          </TableRow>
        ))
      );
    }, [checkboxMatrix]);

    if (Object.keys(checkboxMatrix).length === 0)
      return (
        <Box
          style={{
            display: 'flex',
            justifyContent: 'center',
            margin: '20px',
          }}
        >
          <CircularProgress />
        </Box>
      );

    return (
      <Box>
        <SelectorTable stickyHeader size="small">
          <TableHead>
            <TableRow>{renderHeaderCheckboxes()}</TableRow>
          </TableHead>
          <TableBody>{renderRows()}</TableBody>
        </SelectorTable>
      </Box>
    );
  },
);
