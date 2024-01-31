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
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { loop } from '../../utils/arrayUtil';
import { createGADM41GeoJsonUrlList } from '../../services/gadm/fetchGADMCountries';
import { TextCopyComponent } from '../../../components/TextCopyComponent/TextCopyComponent';
import { InlineIcon } from '../../../components/InlineIcon/InlineIcon';

interface GADMResourceSelectorProps {
  countries: Array<{ code: string; name: string; level: number }>;
}

export interface GADMResourceSelectorFunctions {
  getSelectionMatrix: () => boolean[][];
}

const LEVEL_MAX = 4;
const LEVELS = loop(LEVEL_MAX);

export const GADMResourceSelector = forwardRef<
  GADMResourceSelectorFunctions,
  GADMResourceSelectorProps
>(({ countries }, ref) => {
  const [selectionMatrix, setSelectionMatrix] = useState<boolean[][]>([]);
  const [numSelected, setNumSelected] = useState<number>(0);

  useImperativeHandle(
    ref,
    () => ({
      getSelectionMatrix,
    }),
    [selectionMatrix],
  );

  const getSelectionMatrix = (): boolean[][] => {
    return selectionMatrix.slice(1).map((row) => row.slice(1));
  };

  const [downloadUrlListString, setDownloadUrlListString] =
    useState<string>('');

  useEffect(() => {
    setDownloadUrlListString(
      createGADM41GeoJsonUrlList(countries, getSelectionMatrix(), false).join(
        '\n',
      ),
    );
  }, [countries, selectionMatrix]);

  // 初期状態の設定
  useEffect(() => {
    const initialMatrix: boolean[][] = new Array<boolean[]>(
      countries.length + 1,
    );
    initialMatrix[0] = new Array<boolean>(LEVEL_MAX + 2).fill(false);
    countries.forEach((item, dataIndex) => {
      initialMatrix[dataIndex + 1] = new Array<boolean>(item.level + 2);
      initialMatrix[dataIndex + 1].fill(false);
    });
    setSelectionMatrix(initialMatrix);
  }, [countries]);

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
    for (let level = 0; level + 1 < selectionMatrix[rowIndex].length; level++) {
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
    const newMatrix = [...selectionMatrix];
    const newValue = !newMatrix[rowIndex][columnIndex];
    newMatrix[rowIndex][columnIndex] = newValue;
    setSelectionMatrix(newMatrix);
    if (0 < rowIndex && 0 < columnIndex) {
      setNumSelected(numSelected + (newValue ? 1 : -1));
    }
  };

  // 行見出しまたは列見出しのチェックボックスを更新する関数
  const handleRowHeaderCheckboxChange = (rowIndex: number) => {
    const newMatrix = [...selectionMatrix];
    const newValue = !newMatrix[rowIndex][0];
    let newValueCount = 0;
    newMatrix[rowIndex][0] = newValue;
    for (
      let columnIndex = 1;
      columnIndex < newMatrix[rowIndex].length;
      columnIndex++
    ) {
      if (newMatrix[rowIndex][columnIndex] !== newValue && 0 < rowIndex) {
        newValueCount += newValue ? 1 : -1;
      }
      newMatrix[rowIndex][columnIndex] = newMatrix[rowIndex][0];
    }
    setSelectionMatrix(newMatrix);
    setNumSelected(numSelected + newValueCount);
  };

  const handleColumnHeaderCheckboxChange = (columnIndex: number) => {
    const newMatrix = [...selectionMatrix];
    const newValue = !newMatrix[0][columnIndex];
    let newValueCount = 0;
    newMatrix[0][columnIndex] = newValue;
    for (let rowIndex = 1; rowIndex < newMatrix.length; rowIndex++) {
      if (columnIndex < newMatrix[rowIndex].length) {
        if (newMatrix[rowIndex][columnIndex] !== newValue && 0 < columnIndex) {
          newValueCount += newValue ? 1 : -1;
        }
        newMatrix[rowIndex][columnIndex] = newValue;
      }
    }
    setSelectionMatrix(newMatrix);
    setNumSelected(numSelected + newValueCount);
  };
  const handleAllCheckboxChange = () => {
    const newMatrix = [...selectionMatrix];
    const newValue = !newMatrix[0][0];
    let newValueCount = 0;
    for (let rowIndex = 0; rowIndex < newMatrix.length; rowIndex++) {
      for (
        let columnIndex = 0;
        columnIndex < newMatrix[rowIndex].length;
        columnIndex++
      ) {
        if (
          newMatrix[rowIndex][columnIndex] !== newValue &&
          0 < rowIndex &&
          0 < columnIndex
        ) {
          newValueCount += newValue ? 1 : -1;
        }
        newMatrix[rowIndex][columnIndex] = newValue;
      }
    }
    setSelectionMatrix(newMatrix);
    setNumSelected(numSelected + newValueCount);
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
              <Typography sx={{ fontStyle: 'bold' }}>Level {level}</Typography>
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

      {numSelected > 0 && (
        <Box
          style={{
            position: 'absolute',
            bottom: '10px',
            width: '100vw',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography>
            {numSelected + (numSelected > 1 ? ' files' : ' file') + ' selected'}{' '}
            <InlineIcon>
              <TextCopyComponent text={downloadUrlListString} />
            </InlineIcon>
          </Typography>
        </Box>
      )}
    </Box>
  );
});
