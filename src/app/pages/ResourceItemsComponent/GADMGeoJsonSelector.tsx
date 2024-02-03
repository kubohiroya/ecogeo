import {
  Box,
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { memo, useMemo } from 'react';
import { useAtom } from 'jotai';
import { selectedMatrixAtom } from './GADMGeoJsonComponent';
import { loop } from '../../utils/arrayUtil';

interface GADMResourceSelectorProps {
  readonly countries: Array<{ code: string; name: string; level: number }>;
  levelMax: number;
}

export const GADMGeoJsonSelector = memo(
  ({ levelMax, countries }: GADMResourceSelectorProps) => {
    const [selectionMatrix, setSelectionMatrix] = useAtom(selectedMatrixAtom);
    const LEVELS = loop(levelMax);

    const getColumnMixedState = (columnIndex: number) => {
      let numCell = 0;
      let numTrue = 0;
      let numFalse = 0;
      for (let rowIndex = 1; rowIndex < selectionMatrix.length; rowIndex++) {
        if (columnIndex < selectionMatrix[rowIndex].length) {
          numCell++;
          if (selectionMatrix[rowIndex][columnIndex]) {
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
    };

    // 行のチェック状態を集計する関数
    const getRowMixedState = (rowIndex: number) => {
      let numCell = 0;
      let numTrue = 0;
      let numFalse = 0;
      for (
        let level = 0;
        level + 1 < selectionMatrix[rowIndex].length;
        level++
      ) {
        numCell++;
        if (selectionMatrix[rowIndex][level + 1]) {
          numTrue++;
        } else {
          numFalse++;
        }
        if (numCell === numTrue || numCell === numFalse) {
          continue;
        }
        return true;
      }
      return false;
    };

    // チェックボックスの状態を更新する関数
    const handleCheckboxChange = (rowIndex: number, columnIndex: number) => {
      setSelectionMatrix((draft) => {
        draft[rowIndex][columnIndex] = !draft[rowIndex][columnIndex];
        return draft;
      });
    };

    // 行見出しまたは列見出しのチェックボックスを更新する関数
    const handleRowHeaderCheckboxChange = (rowIndex: number) => {
      setSelectionMatrix((draft) => {
        const newValue = !draft[rowIndex][0];
        draft[rowIndex][0] = newValue;
        for (
          let columnIndex = 1;
          columnIndex < draft[rowIndex].length;
          columnIndex++
        ) {
          draft[rowIndex][columnIndex] = draft[rowIndex][0];
        }
        return draft;
      });
    };

    const handleColumnHeaderCheckboxChange = (columnIndex: number) => {
      setSelectionMatrix((draft) => {
        const newValue = !draft[0][columnIndex];
        draft[0][columnIndex] = newValue;
        for (let rowIndex = 1; rowIndex < draft.length; rowIndex++) {
          if (columnIndex < draft[rowIndex].length) {
            draft[rowIndex][columnIndex] = newValue;
          }
        }
        return draft;
      });
    };

    const handleAllCheckboxChange = () => {
      setSelectionMatrix((draft) => {
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
      });
    };

    // テーブルの見出し行のチェックボックスをレンダリングする関数
    const renderHeaderCheckboxes = useMemo(() => {
      return (
        Object.keys(selectionMatrix).length > 0 && (
          <>
            <TableCell component="th" scope="row">
              <Checkbox
                checked={selectionMatrix[0][0]}
                indeterminate={selectionMatrix[0][0] === undefined}
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
                  checked={selectionMatrix[0][level + 1]}
                  indeterminate={getColumnMixedState(level + 1)}
                  onChange={() => handleColumnHeaderCheckboxChange(level + 1)}
                  name={`${level}`}
                />
                <Typography sx={{ fontStyle: 'bold' }}>
                  Level {level}
                </Typography>
              </TableCell>
            ))}
          </>
        )
      );
    }, [selectionMatrix]);

    // テーブルの各行をレンダリングする関数
    const renderRows = useMemo(() => {
      return (
        selectionMatrix.length > 0 &&
        countries.map((item, dataIndex) => (
          <TableRow key={dataIndex}>
            <TableCell component="th" scope="row">
              <Checkbox
                checked={selectionMatrix[dataIndex + 1][0]}
                indeterminate={getRowMixedState(dataIndex + 1)}
                onChange={() => handleRowHeaderCheckboxChange(dataIndex + 1)}
                name={`${dataIndex + 1}`}
              />
              <a
                href={`https://gadm.org/maps/${item.code}.html`}
                target="_blank"
                rel="noreferrer"
              >
                {item.name}({item.code})
              </a>
            </TableCell>
            {LEVELS.map((level: number) => (
              <TableCell key={level}>
                {level <= item.level && (
                  <>
                    <Checkbox
                      checked={selectionMatrix[dataIndex + 1][level + 1]}
                      onChange={() =>
                        handleCheckboxChange(dataIndex + 1, level + 1)
                      }
                      name={`${dataIndex + 1}_${level + 1}`}
                    />
                    {level === 0 && (
                      <a
                        href={`https://gadm.org/maps/${item.code}.html`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {level}
                      </a>
                    )}
                    {level === 1 && (
                      <a
                        href={`https://gadm.org/maps/${item.code}_${level}.html`}
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
    }, [countries, selectionMatrix]);

    if (Object.keys(selectionMatrix).length === 0)
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
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>{renderHeaderCheckboxes}</TableRow>
          </TableHead>
          <TableBody>{renderRows}</TableBody>
        </Table>
      </Box>
    );
  },
);
