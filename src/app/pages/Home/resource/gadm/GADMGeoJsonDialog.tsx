import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Step,
  StepButton,
  Stepper,
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { DOCUMENT_TITLE } from '~/app/Constants';
import { useAtom, useAtomValue } from 'jotai';
import {
  downloadStatusAtom,
  downloadSummaryStatusAtom,
  geoJsonCountryMetadataListAtom,
} from './GADMGeoJsonDialogAtoms';

import { useDownloadGADMJsonFiles } from './useDownloadGADMJsonFiles';
import { Step2DialogContent } from './Step2DialogContent';
import { Step1DialogContent } from './Step1DialogContent';
import { Step6DialogContent } from './Step6DialogContent';
import { Step5DialogContent } from './Step5DialogContent';
import { Step3DialogContent } from './Step3DialogContent';
import {
  createGADM41GeoJsonUrlList,
  downloadGeoJsonIndexFile,
} from './GADMGeoJsonIndexService';
import { GADMGeoJsonCountryMetadata } from '~/app/models/GADMGeoJsonCountryMetadata';
import { StepStatus, StepStatuses } from './StepStatuses';
import { Step4DialogContent } from './Step4DialogContent';
import { ResourceTypes } from '~/app/models/ResourceType';

type Step = {
  label: string;
  contents: ReactNode;
  onEnter: () => Promise<void>;
  onLeave: () => Promise<void>;
};

const LEVEL_MAX = 3;

function createInitialCheckboxMatrix(
  levelMax: number,
  countryMetadataList: GADMGeoJsonCountryMetadata[],
) {
  return [
    new Array<boolean>(levelMax + 1).fill(false),
    ...countryMetadataList.map((item, dataIndex) => {
      return new Array<boolean>(Math.min(levelMax + 1, item.maxLevel + 2)).fill(
        false,
      );
    }),
  ];
}

export const GADMGeoJsonDialog = () => {
  const [uuid, setUuid] = useState<string>('');
  const [stepIndex, setStepIndex] = React.useState(1); // 0
  const [stepStatus, setStepStatus] = React.useState<(StepStatus | null)[]>([
    StepStatuses.done,
    StepStatuses.display,
    null,
    null,
    null,
  ]); // new Array<StepStatus>(NUM_STEPS),
  const [countryMetadataList, setCountryMetadataList] = useAtom(
    geoJsonCountryMetadataListAtom,
  );

  const [checkboxMatrix, setCheckboxMatrix] = useState<boolean[][]>(
    createInitialCheckboxMatrix(LEVEL_MAX, countryMetadataList),
  );

  useEffect(() => {
    setCheckboxMatrix(
      createInitialCheckboxMatrix(LEVEL_MAX, countryMetadataList),
    );
  }, [countryMetadataList]);

  const [urlList, setUrlList] = useState<string[]>([]);

  const downloadStatus = useAtomValue(downloadStatusAtom);

  const downloadSummaryStatus = useAtomValue(downloadSummaryStatusAtom);

  const [, setSimplifyLevel] = useState(3);

  const { downloadGADMGeoJsonFiles } = useDownloadGADMJsonFiles();

  useEffect(() => {
    document.title = DOCUMENT_TITLE + ' - Setup GADM maps';
  }, []);

  const allStepsCompleted = () => {
    return Object.values(stepStatus).every(
      (task) => task === StepStatuses.done,
    );
  };

  const goBack = async () => {
    await leaveFrom(stepIndex);
    if (stepIndex === 0) {
      return navigate('/resources', { replace: true });
    }
    setStepIndex(stepIndex - 1);
    await enterTo(stepIndex - 1);
  };

  const navigate = useNavigate();

  const goNext = async () => {
    if (0 <= stepIndex) {
      await leaveFrom(stepIndex);
    }
    if (stepIndex < steps.length) {
      await enterTo(stepIndex + 1);
      setStepIndex(stepIndex + 1);
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

  const handleClickNext = useCallback(
    (index: number) => () => {
      //enterTo: (newStepIndex: number) => Promise<void>;
      setStepStatus((prevStepStatus) => {
        const newStepStatus = [...prevStepStatus];
        newStepStatus[index] = StepStatuses.done;
        return newStepStatus;
      });
    },
    [],
  );

  const updateStepStatus = (stepIndex: number, status?: StepStatus) => {
    setStepStatus((prevStepStatus) => {
      const newStepStatus = [...prevStepStatus];
      newStepStatus[stepIndex] = status ? status : StepStatuses.done;
      return newStepStatus;
    });
  };

  const downloadIndexFile = useCallback(async () => {
    updateStepStatus(1, StepStatuses.processing);
    const countryMetadataList: GADMGeoJsonCountryMetadata[] =
      await downloadGeoJsonIndexFile();
    setCountryMetadataList(countryMetadataList);

    updateStepStatus(1);

    handleClickNext(1);
  }, [setCountryMetadataList]);

  const updateUrlList = useCallback(
    (newCheckboxMatrix: boolean[][]) => {
      setCheckboxMatrix(newCheckboxMatrix);
      const newUrlList = createGADM41GeoJsonUrlList(
        countryMetadataList,
        newCheckboxMatrix,
        false,
      );
      console.log('updateUrlList', newUrlList);
      setUrlList(newUrlList);
      updateStepStatus(2);
    },
    [countryMetadataList, setCheckboxMatrix, setUrlList],
  );

  const onFinishLoadingGeoJsonFiles = useCallback(() => {
    updateStepStatus(3);
  }, []);

  const isNextButtonDisabled = () => {
    return (
      stepIndex !== 4 &&
      stepIndex !== 5 &&
      stepStatus[stepIndex] !== StepStatuses.done
    );
  };

  const steps: Step[] = [
    {
      label: 'Step 1: Read and accept the GADM license',
      contents: (
        <Step1DialogContent
          {...{ handleClick: handleClickNext(0), stepStatus }}
        />
      ),
      onEnter: async () => {},
      onLeave: async () => {},
    },
    {
      label: 'Step 2: Download the index file',
      contents: (
        <Step2DialogContent
          {...{ handleClick: downloadIndexFile, stepStatus }}
        />
      ),
      onEnter: async () => {},
      onLeave: async () => {},
    },
    {
      label: 'Step 3: Select countries/levels to be downloaded',
      contents: (
        <Step3DialogContent
          {...{
            LEVEL_MAX,
            countryMetadataList,
            checkboxMatrix,
            onChange: updateUrlList,
            urlList,
          }}
        />
      ),
      onEnter: async () => {},
      onLeave: async () => {},
    },
    {
      label: 'Step 4: Download the countries/levels files',
      contents: (
        <Step4DialogContent
          {...{
            urlList,
            downloadSummaryStatus,
            downloadStatus,
          }}
        />
      ),
      onEnter: async () => {
        const uuid = await downloadGADMGeoJsonFiles(
          countryMetadataList,
          checkboxMatrix,
          urlList,
          onFinishLoadingGeoJsonFiles,
        );
        setUuid(uuid);
      },
      onLeave: async () => {},
    },
    {
      label: 'Step 5: Simplify polygons',
      contents: <Step5DialogContent {...{ setSimplifyLevel }} />,
      onEnter: async () => {},
      onLeave: async () => {},
    },
    {
      label: 'Step 6: Finish',
      contents: <Step6DialogContent />,
      onEnter: async () => {},
      onLeave: async () => {
        return navigate(
          `/resources/update/${ResourceTypes.gadmGeoJson}/${uuid}`,
        );
      },
    },
  ];

  return (
    <Dialog open={true} maxWidth="xl">
      <DialogTitle>
        <Typography>Create a new resource from the GADM maps</Typography>
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
        </Box>
      </DialogContent>
      <DialogActions sx={{ margin: '10px' }}>
        <Link to="/resources">
          <IconButton
            size="large"
            sx={{
              position: 'absolute',
              top: '4px',
              right: '4px',
            }}
          >
            <Close style={{ width: '40px', height: '40px' }} />
          </IconButton>
        </Link>
        <Button
          size="large"
          style={{ padding: '16px 48px 16px 48px' }}
          variant={'contained'}
          color="inherit"
          disabled={stepStatus[stepIndex] === StepStatuses.onEnterTask}
          onClick={goBack}
        >
          {stepIndex === 0 ? 'Cancel' : 'Back'}
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        <Button
          size="large"
          style={{ padding: '16px 48px 16px 48px' }}
          variant={'contained'}
          disabled={isNextButtonDisabled()}
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
