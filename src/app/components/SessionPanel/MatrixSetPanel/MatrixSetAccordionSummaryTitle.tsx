import React from 'react';
import { Box, Typography } from '@mui/material';
import { VertexChip } from './VertexChip';
import { City } from '../../../model/City';
import styled from '@emotion/styled';

const VertexChipBox = styled(Box)`
  overflow: scroll;
`;
export const MatrixSetAccordionSummaryTitle = ({
  locations,
  selectedIndices,
  focusedIndices,
  onFocus,
  onUnfocus,
  onUnselect,
  setLockDiagonalMatrixSetPanelAccordion,
}: {
  locations: City[];
  selectedIndices: number[];
  focusedIndices: number[];
  onFocus: (focusedIndices: number[]) => void;
  onUnfocus: (focusedIndices: number[]) => void;
  onUnselect: (prevSelectedIndices: number[], nodeIds: number[]) => void;
  setLockDiagonalMatrixSetPanelAccordion: (lock: boolean) => void;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <Typography sx={{ fontSize: '110%', padding: '0 12px 0 12px' }}>
        Matrices :
      </Typography>
      {selectedIndices && (
        <VertexChipBox>
          {selectedIndices.map(
            (selectedNodeIndex, index) =>
              locations[selectedNodeIndex] && (
                <VertexChip
                  key={index}
                  index={selectedNodeIndex}
                  label={locations[selectedNodeIndex].label}
                  focused={focusedIndices.includes(selectedNodeIndex)}
                  onMouseEnter={() => {
                    onFocus([selectedNodeIndex]);
                    setLockDiagonalMatrixSetPanelAccordion(true);
                  }}
                  onMouseLeave={() => {
                    onUnfocus([selectedNodeIndex]);
                    setTimeout(
                      () => setLockDiagonalMatrixSetPanelAccordion(false),
                      3000
                    );
                  }}
                  onMouseUp={() => {
                    setLockDiagonalMatrixSetPanelAccordion(true);
                    setTimeout(
                      () => setLockDiagonalMatrixSetPanelAccordion(false),
                      300
                    );
                    onUnselect(selectedIndices, [selectedNodeIndex]);
                  }}
                />
              )
          )}
        </VertexChipBox>
      )}
    </Box>
  );
};
