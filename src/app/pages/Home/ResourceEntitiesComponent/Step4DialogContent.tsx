import { LoadingProgress } from 'src/app/services/file/LoadingProgress';
import { FetchStatus } from 'src/app/services/file/FetchFiles';
import {
  Alert,
  Badge,
  Box,
  Chip,
  CircularProgress,
  Stack,
} from '@mui/material';
import { FileLoadingStatusTypes } from 'src/app/services/file/FileLoadingStatusType';
import { LinearProgressWithLabel } from 'src/components/LinearProgressWithLabel/LinearProgressWithLabel';
import { Done, Download, ReportProblem } from '@mui/icons-material';
import React from 'react';

export function Step4DialogContent(props: {
  urlList: string[];
  downloadSummaryStatus: Awaited<LoadingProgress>;
  downloadStatus: Awaited<
    Record<
      string,
      {
        status: FetchStatus;
        retry?: number;
      }
    >
  >;
}) {
  return (
    <>
      {props.urlList.length === 0 && (
        <Alert severity="warning">
          [{props.urlList.length}] No data file to download at this time. Skip
          to next.
        </Alert>
      )}

      {props.downloadSummaryStatus &&
        props.downloadSummaryStatus.type === FileLoadingStatusTypes.loading &&
        props.downloadSummaryStatus.progress < 100 && (
          <>
            <CircularProgress variant="indeterminate" />
            <Alert severity="info">downloading files...</Alert>
          </>
        )}

      {props.urlList &&
        props.urlList.length >= 1 &&
        props.downloadSummaryStatus && (
          <LinearProgressWithLabel
            variant={'determinate'}
            loaded={props.downloadSummaryStatus.loaded}
            total={props.downloadSummaryStatus.total}
            value={props.downloadSummaryStatus.progress}
          />
        )}

      <Box style={{ margin: '20px' }}>
        <Stack direction="column" spacing={2}>
          {props.urlList &&
            props.urlList.map((url, index) => {
              const urlStatus = props.downloadStatus[url];
              if (!urlStatus) {
                return (
                  <Chip
                    key={index}
                    label={url}
                    variant="outlined"
                    deleteIcon={<Download />}
                  />
                );
              } else if (urlStatus.status === FetchStatus.loading) {
                return (
                  <Chip key={index} label={url} deleteIcon={<Download />} />
                );
              } else if (urlStatus.status === FetchStatus.success) {
                return (
                  <Chip
                    color="primary"
                    key={index}
                    label={url}
                    deleteIcon={<Done />}
                  />
                );
              } else if (urlStatus.status === FetchStatus.error) {
                return (
                  <Badge
                    key={index}
                    badgeContent={urlStatus.retry}
                    color="warning"
                  >
                    <Chip
                      color={'warning'}
                      label={url}
                      deleteIcon={<ReportProblem />}
                    />
                  </Badge>
                );
              } else {
                return <></>;
              }
            })}
        </Stack>
      </Box>
    </>
  );
}
