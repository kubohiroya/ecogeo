import React, { ReactNode, useEffect, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormGroup,
  IconButton,
  Slider,
  Stack,
  Step,
  StepButton,
  Stepper,
  Tooltip,
  Typography,
} from '@mui/material';
import { InlineIcon } from '../../../components/InlineIcon/InlineIcon';
import {
  Close,
  Done,
  Download,
  Launch,
  ReportProblem,
} from '@mui/icons-material';
import {
  fetchGADMCountries,
  fetchGADMGeoJsonArray,
  FetchStatus,
  GADMCountryMetadata,
} from '../../services/gadm/fetchGADMCountries';
import {
  GADMResourceSelector,
  GADMResourceSelectorFunctions,
} from './GADMResourceSelector';
import { LinearProgressWithLabel } from '../../../components/LinearProgressWithLabel/LinearProgressWithLabel';
import { useNavigate } from 'react-router-dom';

type Step = {
  label: string;
  contents: ReactNode;
  onEnter: () => Promise<void>;
  onLeave: () => Promise<void>;
};

enum StepStatus {
  onEnterTask,
  display,
  onLeaveTask,
  done,
}

const NUM_STEPS = 5;

export const FetchGADMResourcesComponent = () => {
  const navigete = useNavigate();
  const [stepIndex, setStepIndex] = React.useState(0);
  const [stepStatus, setStepStatus] = React.useState<StepStatus[]>(
    new Array<StepStatus>(NUM_STEPS),
  );

  const [countries, setCountries] = useState<null | GADMCountryMetadata[]>(
    null,
  );
  const gadmResourceSelectorRef = useRef<null | GADMResourceSelectorFunctions>(
    null,
  );
  const [selectionMatrix, setSelectionMatrix] = useState<boolean[][]>([]);
  const [simplifyLevel, setSimplifyLevel] = useState(3);
  const [downloadingUrlList, setDownloadingUrlList] = useState<string[] | null>(
    null,
  );
  const [downloadingUrlStatus, setDownloadingUrlStatus] = useState<
    Record<string, { status: FetchStatus; error?: any; retry?: number }>
  >({});
  const [loadingProgress, setLoadingProgress] = useState<{
    index: number;
    total: number;
    progress: number;
  } | null>(null);

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.values(stepStatus).filter((task) => task == StepStatus.done)
      .length;
  };

  const isLastStep = () => {
    return stepIndex === NUM_STEPS - 1;
  };

  const allStepsCompleted = () => {
    return Object.values(stepStatus).every((task) => task == StepStatus.done);
  };

  const goBack = async () => {
    await leaveFrom(stepIndex);
    setStepIndex(stepIndex - 1);
    await enterTo(stepIndex - 1);
  };

  const goNext = async () => {
    await leaveFrom(stepIndex);
    setStepIndex(stepIndex + 1);
    await enterTo(stepIndex + 1);
  };

  const leaveFrom = async (stepIndex: number) => {
    setStepStatus((prevStepStatus) => {
      const newStepStatus = [...prevStepStatus];
      newStepStatus[stepIndex] = StepStatus.onLeaveTask;
      return newStepStatus;
    });

    await steps[stepIndex].onLeave();

    setStepStatus((prevStepStatus) => {
      const newStepStatus = [...prevStepStatus];
      newStepStatus[stepIndex] = StepStatus.done;
      return newStepStatus;
    });
  };

  const enterTo = async (newStepIndex: number) => {
    if (0 <= newStepIndex) {
      setStepStatus((prevStepStatus) => {
        const newStepStatus = [...prevStepStatus];
        newStepStatus[newStepIndex] = StepStatus.onEnterTask;
        return newStepStatus;
      });

      await steps[newStepIndex].onEnter();

      setStepStatus((prevStepStatus) => {
        const newStepStatus = [...prevStepStatus];
        newStepStatus[newStepIndex] = StepStatus.display;
        return newStepStatus;
      });
    }
  };

  useEffect(() => {
    setStepIndex(0);
    enterTo(0);
  }, []);

  const steps: Step[] = [
    {
      label: 'Step 1: Accept the GADM license',
      contents: (
        <>
          <DialogContentText>
            The data are freely available for academic use and other
            non-commercial use. Redistribution, or commercial use is not allowed
            without prior permission. See the license for more details.
          </DialogContentText>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px',
            }}
          >
            <Button variant={'outlined'} onClick={() => enterTo(1)}>
              <a href="https://gadm.org/license.html" target="_blank">
                See the license
                <InlineIcon>
                  <Launch />
                </InlineIcon>
              </a>
            </Button>
          </Box>
        </>
      ),
      onEnter: async () => {
        enterTo(1);
      },
      onLeave: async () => {},
    },
    {
      label: 'Step 2: Download the index file',
      contents: (
        <>
          <DialogContentText>
            The country index is a list of all the countries that are available.
            This is used to download the maps.
          </DialogContentText>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px',
            }}
          >
            <Button
              size="large"
              variant="contained"
              onClick={() => goNext()}
              disabled={
                stepStatus[1] == StepStatus.onLeaveTask ||
                stepStatus[1] == StepStatus.done
              }
            >
              {stepStatus[1] == StepStatus.display
                ? 'Download GADM Index'
                : stepStatus[1] == StepStatus.onLeaveTask
                  ? 'download GADM files...'
                  : 'download GADM files finished'}
            </Button>
          </Box>
        </>
      ),
      onEnter: async () => {},
      onLeave: async () => {
        setCountries([]);
        const countries = await fetchGADMCountries();
        setCountries(countries);
      },
    },
    {
      label: 'Step 3: Select data files',
      contents: (
        <FormGroup>
          <DialogContentText>
            Please select data items to download
          </DialogContentText>
          {!countries || countries.length == 0 ? (
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                margin: '8px',
              }}
            >
              <CircularProgress variant="indeterminate" />
            </Box>
          ) : (
            <GADMResourceSelector
              ref={gadmResourceSelectorRef}
              countries={countries}
            />
          )}
        </FormGroup>
      ),
      onEnter: async () => {},
      onLeave: async () => {
        const selectionMatrix =
          gadmResourceSelectorRef.current?.getSelectionMatrix();
        if (!selectionMatrix) throw new Error('selectionMatrix is null');
        setSelectionMatrix(selectionMatrix);
      },
    },
    {
      label: 'Step 4: Download data files',
      contents: (
        <>
          {downloadingUrlList && downloadingUrlList.length == 0 && (
            <Box>
              <DialogContentText>
                No data file to download at this time. Skip to next.
              </DialogContentText>
            </Box>
          )}
          {(downloadingUrlList == null ||
            (loadingProgress && loadingProgress?.progress < 100)) && (
            <Box>
              <CircularProgress variant="indeterminate" /> downloading...
            </Box>
          )}
          {downloadingUrlList &&
            downloadingUrlList.length >= 1 &&
            loadingProgress && (
              <LinearProgressWithLabel
                variant={'determinate'}
                index={loadingProgress.index}
                total={loadingProgress.total}
                value={loadingProgress.progress}
              />
            )}
          <Box style={{ margin: '20px' }}>
            <Stack direction="column" spacing={2}>
              {downloadingUrlList &&
                downloadingUrlList.map((url, index) => {
                  const urlStatus = downloadingUrlStatus[url];
                  if (!urlStatus) {
                    return <Chip key={index} label={url} color="primary" />;
                  } else if (urlStatus.status == FetchStatus.loading) {
                    return (
                      <Chip key={index} label={url} deleteIcon={<Download />} />
                    );
                  } else if (urlStatus.status == FetchStatus.success) {
                    return (
                      <Chip
                        color={'success'}
                        key={index}
                        label={url}
                        deleteIcon={<Done />}
                      />
                    );
                  } else if (urlStatus.status == FetchStatus.error) {
                    return (
                      <Tooltip key={index} title={urlStatus.error.message}>
                        <Badge badgeContent={urlStatus.retry} color="warning">
                          <Chip
                            color={'warning'}
                            label={url}
                            deleteIcon={<ReportProblem />}
                          />
                        </Badge>
                      </Tooltip>
                    );
                  }
                })}
            </Stack>
          </Box>
        </>
      ),
      onEnter: async () => {
        if (!countries) {
          throw new Error();
        }
        setDownloadingUrlList([]);
        setDownloadingUrlStatus({});
        requestIdleCallback(async () => {
          const jsonArray = await fetchGADMGeoJsonArray(
            countries,
            selectionMatrix,
            (urlList: string[]) => {
              setDownloadingUrlList(urlList);
            },
            (url: string, urlStatus: { status: FetchStatus; error?: any }) => {
              setDownloadingUrlStatus((prev) => {
                return {
                  ...prev,
                  [url]: urlStatus,
                };
              });
            },
            ({
              progress,
              index,
              total,
            }: {
              progress: number;
              index: number;
              total: number;
            }) => {
              setLoadingProgress({ progress, index, total });
            },
          );
          console.log(jsonArray);
        });
      },
      onLeave: async () => {},
    },
    {
      label: 'Step 5: Simplify polygons',
      contents: (
        <>
          <DialogContentText>
            Simplify polygons to reduce heavy load of CPU/Memory/Storage.
          </DialogContentText>
          <Box
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px',
            }}
          >
            <Slider
              sx={{ width: '70%' }}
              min={0}
              defaultValue={3}
              max={6}
              step={1}
              marks={[
                { value: 0, label: '0.1 (Low Quality)' },
                { value: 1, label: '0.05' },
                { value: 2, label: '0.01' },
                { value: 3, label: '0.005' },
                { value: 4, label: '0.001' },
                { value: 5, label: '0.0005' },
                { value: 6, label: '0.0001 (High Quality)' },
              ]}
              onChangeCommitted={(e, value) => {
                setSimplifyLevel(value as number);
              }}
            />
          </Box>
        </>
      ),
      onEnter: async () => {},
      onLeave: async () => {},
    },
  ];

  return (
    <Dialog open={true} fullScreen>
      <DialogTitle>
        <Typography>Setup the GADM maps</Typography>
        <Stepper
          activeStep={stepIndex}
          style={{ marginLeft: '48px', marginRight: '48px', marginTop: '16px' }}
        >
          {steps.map((step, index) => (
            <Step
              key={step.label}
              completed={stepStatus[index] === StepStatus.done}
            >
              <StepButton color="inherit">{step.label}</StepButton>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>
      <DialogContent>
        <Box>
          <div>
            {allStepsCompleted() ? (
              <>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  All steps completed - you&apos;re finished
                </Typography>
              </>
            ) : (
              <>
                <Card>
                  <CardContent>
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontStyle: 'bold',
                      }}
                    >
                      {steps[stepIndex].label}
                    </Typography>

                    {steps[stepIndex].contents}
                  </CardContent>
                  <CardActionArea></CardActionArea>
                </Card>
              </>
            )}
          </div>
        </Box>
      </DialogContent>
      <DialogActions sx={{ margin: '10px' }}>
        <IconButton
          size="large"
          sx={{ position: 'absolute', top: '16px', right: '16px' }}
          onClick={() => {
            navigete('/resources', { replace: true });
          }}
        >
          <Close />
        </IconButton>
        <Button
          size="large"
          style={{ padding: '16px 48px 16px 48px' }}
          variant={'contained'}
          color="inherit"
          disabled={
            stepIndex === 0 || stepStatus[stepIndex] == StepStatus.onEnterTask
          }
          onClick={goBack}
        >
          Back
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          size="large"
          style={{ padding: '16px 48px 16px 48px' }}
          variant={'contained'}
          disabled={
            stepStatus[stepIndex] == StepStatus.onEnterTask ||
            stepStatus[stepIndex] == StepStatus.onLeaveTask ||
            stepStatus[stepIndex] == StepStatus.done
          }
          title={
            stepIndex < steps.length - 1 ? `Step ${stepIndex + 1}` : 'Finish'
          }
          onClick={goNext}
        >
          {stepIndex < steps.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
