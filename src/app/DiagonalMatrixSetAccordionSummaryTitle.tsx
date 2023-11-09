import React from 'react';
import { Box, Typography } from '@mui/material';
import { SelectNodeChip } from './SelectNodeChip';

export const DiagonalMatrixSetAccordionSummaryTitle = ({
  selectedNodeIds,
  focusedNodeIds,
  onFocus,
  onUnfocus,
  doUnselectNode,
  setLockDiagonalMatrixSetPanelAccordion,
}: {
  selectedNodeIds: number[];
  focusedNodeIds: number[];
  onFocus: (nodeIds: number[]) => void;
  onUnfocus: (nodeIds: number[]) => void;
  doUnselectNode: (nodeIds: number[]) => void;
  setLockDiagonalMatrixSetPanelAccordion: (lock: boolean) => void;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1 /*, backgroundColor: lockDiagonalMatrixSetPanelAccordion?'gray':'white' */,
      }}
      //onMouseOver={()=>setTimeout(()=>setLockDiagonalMatrixSetPanelAccordion(false), 3000)}
      //onMouseEnter={()=>setTimeout(()=>setLockDiagonalMatrixSetPanelAccordion(false), 3000)}
    >
      <Typography sx={{ fontSize: '110%', padding: '0 12px 0 12px' }}>
        Matrices :
      </Typography>
      {selectedNodeIds && (
        <>
          {selectedNodeIds.map((selectedNodeId, index) => (
            <SelectNodeChip
              key={index}
              nodeId={selectedNodeId}
              focused={focusedNodeIds.includes(selectedNodeId)}
              onMouseEnter={() => {
                onFocus([selectedNodeId]);
                setLockDiagonalMatrixSetPanelAccordion(true);
              }}
              onMouseLeave={() => {
                onUnfocus([selectedNodeId]);
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
                doUnselectNode([selectedNodeId]);
              }}
            />
          ))}
        </>
      )}
    </Box>
  );
};
