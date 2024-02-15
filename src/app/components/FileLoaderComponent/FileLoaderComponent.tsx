import React, { ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, LinearProgress, Typography } from "@mui/material";
import { FileLoaderRequestType } from "~/app/services/file/FileLoaderRequestType";
import { FileLoaderResponse, LoaderProgressResponse } from "~/app/services/file/FileLoaderResponse";
import { FileLoadingStatusType, FileLoadingStatusTypes } from "~/app/services/file/FileLoadingStatusType";
import { FileLoaderResponseType } from "~/app/services/file/FileLoaderResponseType";
import styled from "@emotion/styled";

const DropTarget = styled.div`
  border: 1px dashed gray;
  background-color: rgba(0, 1, 0, 0.1);
  padding: 20px;
  text-align: center;

  .dragging {
    background-color: rgba(0, 1, 0, 0.2);
    border: 1px dashed green;
  }
`;

export const FileLoaderComponent = () => {
  const worker = useMemo(
    () =>
      new Worker(new URL('../../worker/LoaderWorker?worker', import.meta.url), {
        type: 'module',
      }),
    [],
  );

  const ref = useRef<HTMLDivElement | null>(null);

  const [loadingFiles, setLoadingFiles] = useState<
    Record<string, LoaderProgressResponse>
  >({});
  const [loadingStatus, setLoadingStatus] = useState<FileLoadingStatusType>(
    FileLoadingStatusTypes.idle,
  );

  const handleFiles = useCallback(
    (files: FileList) => {
      setLoadingFiles({});
      worker.onmessage = (event: MessageEvent<FileLoaderResponse>) => {
        const response = event.data as any;
        switch (event.data.type) {
          case FileLoaderResponseType.started:
            setLoadingStatus(FileLoadingStatusTypes.started);
            break;
          case FileLoaderResponseType.progress:
            setLoadingFiles({
              ...loadingFiles,
              [response.value.fileName]: response.value,
            });
            break;
          case FileLoaderResponseType.cancel:
            setLoadingStatus(FileLoadingStatusTypes.idle);
            break;
          case FileLoaderResponseType.finished:
            setLoadingStatus(FileLoadingStatusTypes.finished);
            break;
          default:
        }
      };
      worker.postMessage({
        type: FileLoaderRequestType.start,
        data: files,
      });
    },
    [worker, setLoadingFiles, setLoadingStatus],
  );

  const onFileSelectedHandler: ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (ev: any) => {
        const files = (ev.target as HTMLInputElement).files;
        files && handleFiles(files);
      },
      [handleFiles],
    );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles],
  );

  const cancelTask = useCallback(() => {
    worker.postMessage({
      type: FileLoaderRequestType.cancel,
    });
  }, [worker]);

  const closeDialog = useCallback(() => {
    setLoadingFiles({});
  }, [setLoadingFiles]);

  useEffect(() => {
    ref.current?.addEventListener('dragenter', function (event) {
      console.log('over');
      event.preventDefault();
      ref.current?.classList.add('dragging');
    });
    ref.current?.addEventListener('dragleave', function (event) {
      console.log('left');
      event.preventDefault();
      ref.current?.classList.remove('dragging');
    });
  }, [ref.current]);

  return (
    <>
      <DropTarget
        ref={ref}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <Typography>[Status:{loadingStatus}]</Typography>
        <input onChange={onFileSelectedHandler} type="file" multiple />
        Drop your CSV file here
        {loadingStatus !== FileLoadingStatusTypes.idle &&
          loadingStatus !== FileLoadingStatusTypes.finished}
        <Dialog open={true}>
          <DialogTitle> Processing File </DialogTitle>

          <DialogContent>
            {Object.keys(loadingFiles).map((filename) => (
              <Box key={filename}>
                <Typography>FileName:{filename}</Typography>
                <Typography>
                  {loadingFiles[filename].index?.toLocaleString()} /{' '}
                  {loadingFiles[filename].total?.toLocaleString()} (
                  {(
                    (100 * loadingFiles[filename].index) /
                    loadingFiles[filename].total
                  ).toFixed(2)}
                  %)
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={loadingFiles[filename].progress}
                />
                {loadingStatus === FileLoadingStatusTypes.loading ? (
                  <LinearProgress variant="indeterminate" />
                ) : (
                  <LinearProgress variant="determinate" value={100} />
                )}
              </Box>
            ))}
            <Box style={{ margin: '8px', display: 'flex', gap: '8px' }}>
              <Button
                variant={'contained'}
                onClick={cancelTask}
                disabled={loadingStatus !== FileLoadingStatusTypes.loading}
              >
                Cancel
              </Button>
              <Button
                variant={'contained'}
                onClick={closeDialog}
                disabled={loadingStatus !== FileLoadingStatusTypes.finished}
              >
                Close
              </Button>
            </Box>
          </DialogContent>
        </Dialog>
      </DropTarget>
    </>
  );
};
