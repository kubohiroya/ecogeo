import styled from '@emotion/styled';
import { TableCell, TableRow } from '@mui/material';

export const Row = styled(TableRow)`
  height: 80px;
  border-bottom: solid #ccc 0.5px;
`;

export const Cell = styled(TableCell)`
  display: block;
  max-height: 180px;
  padding-top: 8px;
  padding-bottom: 8px;
  overflow-y: auto;
  border: none;
  background-color: '#ccc';
`;
