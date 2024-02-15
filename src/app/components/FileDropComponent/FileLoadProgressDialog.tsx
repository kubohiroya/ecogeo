import React, { useEffect, useRef, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, LinearProgress, Typography } from "@mui/material";
import styled from "@emotion/styled";

const ProgressDialogContent = styled(DialogContent)`
  padding: 30px;
`;

const ProgressBox = styled.div`
  flex: 1;
  overflow: scroll;
`;

type FileLoadProgressDialogProps = {
  processDialogOpen: boolean;
  loadingFiles: {
    fileName: string;
    progress: number;
    errorMessage?: string;
    index: number;
    total: number;
  }[];
  cancelTask: () => void;
  isFinished: boolean;
  closeDialog: () => void;
};

export function FileLoadProgressDialog({
  processDialogOpen,
  loadingFiles,
  cancelTask,
  isFinished,
  closeDialog,
}: FileLoadProgressDialogProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  const [autoScroll, setAutoScroll] = useState(true);

  const handleUserScroll = () => {
    const viewport = viewportRef.current;
    // ユーザによるスクロール操作があった場合、autoScrollを無効にする
    if (
      viewport &&
      viewport.scrollTop < viewport.scrollHeight - viewport.offsetHeight
    ) {
      setAutoScroll(false);
    }
  };

  useEffect(() => {
    if (autoScroll) {
      const viewport = viewportRef.current;
      if (viewport) {
        viewport.scrollTop = viewport?.scrollHeight;
      }
    }
  }, [loadingFiles, viewportRef, autoScroll]);

  return (
    <Dialog open={processDialogOpen} fullScreen>
      <DialogTitle> Processing File </DialogTitle>
      <ProgressDialogContent>
        <ProgressBox ref={viewportRef} onScroll={handleUserScroll}>
          {Object.values(loadingFiles).map((loadingFile) => (
            <div key={loadingFile.fileName}>
              <Typography>FileName: {loadingFile.fileName}</Typography>
              {loadingFile.progress ? (
                <>
                  <Typography style={{ textAlign: 'right' }}>
                    {loadingFile.index.toLocaleString()} /{' '}
                    {loadingFile.total.toLocaleString()} ({loadingFile.progress}
                    %)
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={loadingFile.progress}
                  />
                  <Typography>
                    <strong>
                      {loadingFile.errorMessage && loadingFile.errorMessage}
                    </strong>
                  </Typography>
                </>
              ) : (
                <LinearProgress variant="indeterminate" />
              )}
            </div>
          ))}
        </ProgressBox>
        <Box
          style={{
            margin: '8px',
            display: 'flex',
            gap: '8px',
            height: '40px',
            alignItems: 'center',
          }}
        >
          <Button
            variant={'contained'}
            onClick={cancelTask}
            disabled={isFinished}
          >
            Cancel
          </Button>
          <Button
            variant={'contained'}
            onClick={closeDialog}
            disabled={!isFinished}
          >
            Close
          </Button>
        </Box>
      </ProgressDialogContent>
    </Dialog>
  );
}
