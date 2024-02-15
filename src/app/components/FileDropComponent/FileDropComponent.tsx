import React, { DragEventHandler, useCallback, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Tooltip, Typography } from "@mui/material";
import { FileLoaderResponse, LoaderProgressResponse } from "~/app/services/file/FileLoaderResponse";
import { FileLoaderRequestType } from "~/app/services/file/FileLoaderRequestType";
import { FileLoaderResponseType } from "~/app/services/file/FileLoaderResponseType";
import { useAtom } from "jotai";
import { GeoDatabaseTableType } from "~/app/models/GeoDatabaseTableType";
import { FileDroppableArea } from "./FileDroppableArea";
import { checkAcceptableFileList, loadingFilesAtom } from "~/app/components/FileDropComponent/FileService";
import { FileLoadProgressDialog } from "~/app/components/FileDropComponent/FileLoadProgressDialog";

//00000

interface FileDropComponentProps {
  type: GeoDatabaseTableType;
  acceptableSuffixes: string[];
  handleFiles: (fileList: FileList) => void;
  onFinish?: (lastUpdated: number) => void;
  children?: React.ReactNode;
}

const PromptMessageBox = styled.div`
  padding: 10px;
`;
const ErrorMessageBox = styled.div`
  color: red;
`;

export const FileDropComponent = (props: FileDropComponentProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isError, setIsError] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [isFinished, setFinished] = useState<boolean>(false);
  const [loadingFiles, setLoadingFiles] = useAtom(loadingFilesAtom);
  const [worker, setWorker] = useState<Worker | null>(null);

  const handleDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);

    if (props.acceptableSuffixes) {
      const result = checkAcceptableFileList(
        event.dataTransfer!.files,
        props.acceptableSuffixes,
      );
      setIsError(result.some((acceptable) => !acceptable));
    } else {
      setIsError(false);
    }
  }, []) as unknown as DragEventHandler<HTMLDivElement>;

  const handleDragLeave = useCallback((event: any) => {
    event.preventDefault();
    setIsDragOver(false);
    setIsError(false);
  }, []);

  const handleFiles = (files: FileList) => {
    const result = checkAcceptableFileList(files, props.acceptableSuffixes);
    const error = result.some((acceptable) => !acceptable);
    setIsError(error);
    props.handleFiles && props.handleFiles(files);
    setLoadingFiles(() => ({}));
    for (let i = 0; i < files.length; i++) {
      worker!.postMessage({
        type: FileLoaderRequestType.start,
        payload: {
          file: files[i],
        },
      });
    }
  };

  const handleDrop = useCallback(
    (event: any) => {
      event.preventDefault();
      setIsDragOver(false);
      const files = event.dataTransfer.files;
      if (event.dataTransfer) {
        if (props.handleFiles) {
          props.handleFiles(files);
        } else {
          handleFiles(files);
        }
      }
    },
    [handleFiles],
  );

  const handleFileInput = useCallback(
    (event: any) => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        if (props.handleFiles) {
          props.handleFiles(files);
        } else {
          handleFiles(files);
        }
        (document.getElementById('file') as any).value = null;
      }
    },
    [handleFiles],
  );

  const cancelTask = useCallback(() => {
    worker!.postMessage({
      type: FileLoaderRequestType.cancel,
    });
    setProcessDialogOpen(false);
    setLoadingFiles(() => ({}));
  }, [worker]);

  const closeDialog = useCallback(() => {
    setProcessDialogOpen(false);
    setLoadingFiles(() => ({}));
  }, [worker]);

  useEffect(() => {
    const worker = new Worker(
      new URL('../../worker/FileLoaderWorker?worker', import.meta.url),
      {
        type: 'module',
      },
    );

    const onStarted = (value: LoaderProgressResponse) => {
      setFinished(false);
      setProcessDialogOpen(true);
      setLoadingFiles((loadingFiles) => ({
        ...loadingFiles,
        [value.fileName]: value,
      }));
    };

    const onProgress = (value: LoaderProgressResponse) => {
      setLoadingFiles((loadingFiles) => ({
        ...loadingFiles,
        [value.fileName]: value,
      }));
      if (value.progress === 100) {
        const allDone = Object.values(loadingFiles).every(
          (loadingFile) => loadingFile.progress === 100,
        );
        if (allDone) {
          setFinished(true);
          props.onFinish && props.onFinish(Date.now());
        }
      }
    };

    worker.onmessage = (event: MessageEvent<FileLoaderResponse>) => {
      const data = event.data as any;
      switch (data.value.type) {
        case FileLoaderResponseType.started:
          onStarted(data.value);
          break;
        case FileLoaderResponseType.progress:
          onProgress(data.value);
          break;
        case FileLoaderResponseType.cancel:
          setLoadingFiles(() => ({}));
          break;
        default:
      }
    };

    setWorker(worker);

    return () => {
      worker.terminate();
    };
  }, []);

  return (
    <>
      <FileDroppableArea
        isDragOver={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        isError={isError}
      >
        <div>{props.children}</div>

        <div>
          <Tooltip
            title={
              'resource files(GADM Shapes GeoJSON files, IDE-GSM cities and routes csv files) and project files'
            }
          >
            <PromptMessageBox>
              <Typography
                style={{ textAlign: 'center', fontWeight: 'bold' }}
              ></Typography>
              <div
                style={{
                  textAlign: 'center',
                  marginTop: '20px',
                  marginLeft: '40px',
                }}
              >
                <input
                  id="file"
                  onChange={handleFileInput}
                  type="file"
                  multiple
                />
              </div>
              <ErrorMessageBox>
                {isError && 'エラー:非対応の拡張子です'}
              </ErrorMessageBox>
            </PromptMessageBox>
          </Tooltip>
        </div>
      </FileDroppableArea>

      <FileLoadProgressDialog
        processDialogOpen={processDialogOpen}
        loadingFiles={Object.values(loadingFiles)}
        cancelTask={cancelTask}
        isFinished={isFinished}
        closeDialog={closeDialog}
      />
    </>
  );
};
