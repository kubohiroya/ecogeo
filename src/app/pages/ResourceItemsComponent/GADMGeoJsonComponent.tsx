import React, { ReactNode, useEffect, useState } from 'react';
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
  createGADM41GeoJsonUrlList,
  fetchFiles,
  fetchGADMCountries,
  FetchStatus,
  GADMCountryMetadata,
  proxyUrl,
} from '../../services/gadm/fetchGADMCountries';
import { GADMResourceSelector } from './GADMResourceSelector';
import { LinearProgressWithLabel } from '../../../components/LinearProgressWithLabel/LinearProgressWithLabel';
import { Link, useNavigate } from 'react-router-dom';
import { DOCUMENT_TITLE } from '../../Constants';
import { v4 as uuidv4 } from 'uuid';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { GeoDatabase } from '../../services/database/GeoDatabase';
import { storeGeoRegions } from '../../services/file/GeoJsonLoaders';
import { LoaderProgressResponse } from '../../services/file/FileLoaderResponse';
import { useAtom, useAtomValue } from 'jotai';
import { atomWithImmer } from 'jotai-immer';
import { atom } from 'jotai/index';
import { TextCopyComponent } from '../../../components/TextCopyComponent/TextCopyComponent';
import { ResourceTypes } from '../../models/ResourceEntity';
// import { loop } from "../../utils/arrayUtil";

type Step = {
  label: string;
  contents: ReactNode;
  onEnter: () => Promise<void>;
  onLeave: () => Promise<void>;
};

const StepStatuses = {
  onEnterTask: 0,
  display: 1,
  onLeaveTask: 2,
  done: 3,
} as const;

type StepStatus = (typeof StepStatuses)[keyof typeof StepStatuses];

const NUM_STEPS = 5;

const initialSelectedMatrix: boolean[][] = [];

export const selectedMatrixAtom = atomWithImmer(initialSelectedMatrix);

const selectedDataAtom = atom((get) => {
  return get(selectedMatrixAtom)
    .slice(1)
    .map((row) => row.slice(1));
});

export const numSelectedAtom = atom((get) => {
  return get(selectedDataAtom)
    .flat()
    .filter((item) => item).length;
});

const urlListAtom = atom((get) => {
  return createGADM41GeoJsonUrlList(
    get(countriesAtom),
    get(selectedDataAtom),
    false,
  );
});

const urlListToStringAtom = atom((get) => {
  return get(urlListAtom).join('\n');
});

const initialCountries: GADMCountryMetadata[] = [];

const initialDownloadStatus: Record<
  string,
  { status: FetchStatus; retry?: number }
> = {};

const countriesAtom = atom(initialCountries);
const downloadStatusAtom = atom(initialDownloadStatus);

export const GADMGeoJsonComponent = () => {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [stepStatus, setStepStatus] = React.useState<StepStatus[]>(
    new Array<StepStatus>(NUM_STEPS),
  );
  const [selectionMatrix, setSelectionMatrix] = useAtom(selectedMatrixAtom);

  const urlList = useAtomValue(urlListAtom);

  const [downloadStatus, setDownloadStatus] = useAtom(downloadStatusAtom);

  const urlListToString = useAtomValue(urlListToStringAtom);

  const [countries, setCountries] = useAtom(countriesAtom);
  const numSelected = useAtomValue(numSelectedAtom);

  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - Setup GADM maps';
  }, []);

  const [, setSimplifyLevel] = useState(3);

  const [loadingProgress, setLoadingProgress] = useState<{
    index: number;
    total: number;
    progress: number;
  } | null>(null);

  const LEVEL_MAX = 4;

  /*
  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.values(stepStatus).filter((task) => task === StepStatus.done)
      .length;
  };

  const isLastStep = () => {
    return stepIndex === NUM_STEPS - 1;
  };
   */

  const allStepsCompleted = () => {
    return Object.values(stepStatus).every(
      (task) => task === StepStatuses.done,
    );
  };

  const goBack = async () => {
    await leaveFrom(stepIndex);
    setStepIndex(stepIndex - 1);
    await enterTo(stepIndex - 1);
  };

  const navigate = useNavigate();

  const goNext = async () => {
    if (0 <= stepIndex) {
      await leaveFrom(stepIndex);
    }
    if (stepIndex < steps.length) {
      setStepIndex(stepIndex + 1);
      await enterTo(stepIndex + 1);
    }
  };

  const leaveFrom = async (stepIndex: number) => {
    setStepStatus((prevStepStatus) => {
      const newStepStatus = [...prevStepStatus];
      newStepStatus[stepIndex] = StepStatuses.onLeaveTask;
      return newStepStatus;
    });

    steps[stepIndex] && (await steps[stepIndex].onLeave());

    setStepStatus((prevStepStatus) => {
      const newStepStatus = [...prevStepStatus];
      newStepStatus[stepIndex] = StepStatuses.done;
      return newStepStatus;
    });
  };

  const enterTo = async (newStepIndex: number) => {
    if (0 <= newStepIndex) {
      setStepStatus((prevStepStatus) => {
        const newStepStatus = [...prevStepStatus];
        newStepStatus[newStepIndex] = StepStatuses.onEnterTask;
        return newStepStatus;
      });

      steps[newStepIndex] && (await steps[newStepIndex].onEnter());

      setStepStatus((prevStepStatus) => {
        const newStepStatus = [...prevStepStatus];
        newStepStatus[newStepIndex] = StepStatuses.display;
        return newStepStatus;
      });
    }
  };

  useEffect(() => {
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
              <a
                href="https://gadm.org/license.html"
                target="_blank"
                rel="noreferrer"
              >
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
        console.log('onEnter 1');
      },
      onLeave: async () => {
        console.log('onLeave 1');
      },
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
                stepStatus[1] === StepStatuses.onLeaveTask ||
                stepStatus[1] === StepStatuses.done
              }
            >
              {stepStatus[1] === StepStatuses.display
                ? 'Download GADM Index'
                : stepStatus[1] === StepStatuses.onLeaveTask
                  ? 'download GADM files...'
                  : 'download GADM files finished'}
            </Button>
          </Box>
        </>
      ),
      onEnter: async () => {
        console.log('onEnter 2');
      },
      onLeave: async () => {
        console.log('onLeave 2');
        const countries = await fetchGADMCountries();
        // console.log(countries);
        setCountries(countries);

        setSelectionMatrix((draft) => {
          draft[0] = new Array<boolean>(LEVEL_MAX + 2).fill(false);
          countries.forEach((item, dataIndex) => {
            draft[dataIndex + 1] = new Array<boolean>(item.level + 2);
            draft[dataIndex + 1].fill(false);
          });
          return draft;
        });
      },
    },
    {
      label: 'Step 3: Select data files',
      contents: (
        <FormGroup>
          <DialogContentText>
            Please select data items to download :
            {selectionMatrix &&
            selectionMatrix.length > 0 &&
            selectionMatrix[0].length > 0
              ? selectionMatrix[0][0]
              : 'undefined'}
          </DialogContentText>
          {!countries || countries.length === 0 ? (
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
            <Box>
              <GADMResourceSelector
                countries={countries}
                levelMax={LEVEL_MAX}
              />
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
                    {numSelected +
                      (numSelected > 1 ? ' files' : ' file') +
                      ' selected'}{' '}
                    <InlineIcon>
                      <TextCopyComponent text={urlListToString} />
                    </InlineIcon>
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </FormGroup>
      ),
      onEnter: async () => {},
      onLeave: async () => {},
    },
    {
      label: 'Step 4: Download data files',
      contents: (
        <>
          {urlList.length === 0 && (
            <Box>
              <DialogContentText>
                [{urlList.length}] No data file to download at this time. Skip
                to next.
              </DialogContentText>
            </Box>
          )}
          {loadingProgress && loadingProgress?.progress < 100 && (
            <Box>
              <CircularProgress variant="indeterminate" /> downloading...
            </Box>
          )}
          {urlList && urlList.length >= 1 && loadingProgress && (
            <LinearProgressWithLabel
              variant={'determinate'}
              index={loadingProgress.index}
              total={loadingProgress.total}
              value={loadingProgress.progress}
            />
          )}
          <Box style={{ margin: '20px' }}>
            <Stack direction="column" spacing={2}>
              {urlList &&
                urlList.map((url, index) => {
                  const urlStatus = downloadStatus[url];
                  if (!urlStatus) {
                    return <Chip key={index} label={url} color="primary" />;
                  } else if (urlStatus.status === FetchStatus.loading) {
                    return (
                      <Chip key={index} label={url} deleteIcon={<Download />} />
                    );
                  } else if (urlStatus.status === FetchStatus.success) {
                    return (
                      <Chip
                        color={'success'}
                        key={index}
                        label={url}
                        deleteIcon={<Done />}
                      />
                    );
                  } else if (urlStatus.status === FetchStatus.error) {
                    return (
                      <Badge badgeContent={urlStatus.retry} color="warning">
                        <Chip
                          color={'warning'}
                          label={url}
                          deleteIcon={<ReportProblem />}
                        />
                      </Badge>
                    );
                  }
                })}
            </Stack>
          </Box>
        </>
      ),
      onEnter: async () => {
        const uuid = uuidv4();
        GeoDatabaseTable.getSingleton().databases.add({
          uuid,
          name: 'GADM GeoJSON',
          description: urlList?.join('\n') || '',
          type: ResourceTypes.gadmShapes,
          urls: Array.from(urlList),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        });

        const database = await GeoDatabaseTable.getSingleton()
          .databases.where('uuid')
          .equals(uuid)
          .last();

        if (!database) {
          throw new Error('Database not found');
        }

        const databaseName = `database${database.id}`;
        const db = await GeoDatabase.open(databaseName);

        console.log(databaseName);

        requestIdleCallback(async () => {
          await fetchFiles(
            urlList.map((url) => proxyUrl(url)),
            (url: string, urlStatus: { status: FetchStatus }) => {
              setDownloadStatus(
                (draft: Record<string, { status: FetchStatus }>) => {
                  return {
                    ...draft,
                    [url]: urlStatus,
                  };
                },
              );
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
            async ({ url, data }: { url: string; data: ArrayBuffer }) => {
              const uint8Array = new Uint8Array(data);
              const stream = new ReadableStream<Uint8Array>({
                start(controller) {
                  controller.enqueue(uint8Array);
                  controller.close();
                },
              });

              await storeGeoRegions({
                db,
                stream,
                fileName: url,
                fileSize: undefined,
                cancelCallback(fileName: string): void {
                  console.warn('*cancel', fileName);
                },
                errorCallback(fileName: string, errorMessage: string): void {
                  console.error('*error', fileName);
                },
                progressCallback(value: LoaderProgressResponse): void {
                  console.log('*progress', value);
                },
                startedCallback(fileName: string): void {
                  console.log('*start', fileName);
                },
                finishedCallback(fileName: string): void {
                  console.log('*finish', fileName);
                },
              });
            },
          );
        });
      },
      onLeave: async () => {
        setDownloadStatus({});
      },
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
    {
      label: 'Step 6: Finish',
      contents: (
        <DialogContentText>
          Congratulations! You finished the GADM resource preparation.
        </DialogContentText>
      ),
      onEnter: async () => {},
      onLeave: async () => {
        return navigate('/resources', { replace: true });
      },
    },
  ];

  return (
    <Dialog open={true} maxWidth="xl">
      <DialogTitle>
        <Typography>Setup the GADM maps</Typography>
        <Stepper
          activeStep={stepIndex}
          style={{ marginLeft: '48px', marginRight: '48px', marginTop: '16px' }}
        >
          {steps.map((step, index) => (
            <Step
              key={step.label}
              completed={stepStatus[index] === StepStatuses.done}
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
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
            ) : (
              <Card>
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: '18px',
                      fontStyle: 'bold',
                    }}
                  >
                    {steps[stepIndex]?.label}
                  </Typography>

                  {steps[stepIndex]?.contents}
                </CardContent>
                <CardActionArea></CardActionArea>
              </Card>
            )}
          </div>
        </Box>
      </DialogContent>
      <DialogActions sx={{ margin: '10px' }}>
        <Link to="/resources">
          <IconButton
            size="large"
            sx={{ position: 'absolute', top: '16px', right: '16px' }}
          >
            <Close />
          </IconButton>
        </Link>
        <Button
          size="large"
          style={{ padding: '16px 48px 16px 48px' }}
          variant={'contained'}
          color="inherit"
          disabled={
            stepIndex === 0 ||
            stepStatus[stepIndex] === StepStatuses.onEnterTask
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
            stepStatus[stepIndex] === StepStatuses.onEnterTask ||
            stepStatus[stepIndex] === StepStatuses.onLeaveTask ||
            stepStatus[stepIndex] === StepStatuses.done
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
