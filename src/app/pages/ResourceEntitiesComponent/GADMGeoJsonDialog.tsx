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
import { DOCUMENT_TITLE } from '../../Constants';
import { useAtom, useAtomValue } from 'jotai';
import {
  downloadStatusAtom,
  downloadSummaryStatusAtom,
  geoJsonCountryMetadataListAtom,
  numSelectedAtom,
  selectedCheckboxMatrixAtom,
  urlListAtom,
  urlListToStringAtom,
} from './GADMGeoJsonServiceAtoms';

import { useDownloadGADMJsonFiles } from './useDownloadGADMJsonFiles';
import { Step2DialogContent } from './Step2DialogContent';
import { Step1DialogContent } from './Step1DialogContent';
import { Step6DialogContent } from './Step6DialogContent';
import { Step5DialogContent } from './Step5DialogContent';
import { Step3DialogContent } from './Step3DialogContent';
import { downloadGeoJsonIndexFile } from './GADMGeoJsonIndexService';
import { GADMGeoJsonCountryMetadata } from '../../models/GADMGeoJsonCountryMetadata';
import { StepStatus, StepStatuses } from './StepStatuses';
import { Step4DialogContent } from './Step4DialogContent';

type Step = {
  label: string;
  contents: ReactNode;
  onEnter: () => Promise<void>;
  onLeave: () => Promise<void>;
};

const NUM_STEPS = 5;

export const GADMGeoJsonDialog = () => {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [stepStatus, setStepStatus] = React.useState<StepStatus[]>(
    new Array<StepStatus>(NUM_STEPS),
  );
  const [selectedCheckboxMatrix, setSelectedCheckboxMatrix] = useAtom(
    selectedCheckboxMatrixAtom,
  );

  const urlList = useAtomValue(urlListAtom);
  const urlListToString = useAtomValue(urlListToStringAtom);

  const [countryMetadataList, setCountryMetadataList] = useAtom(
    geoJsonCountryMetadataListAtom,
  );
  const numSelected = useAtomValue(numSelectedAtom);

  const downloadStatus = useAtomValue(downloadStatusAtom);

  const downloadSummaryStatus = useAtomValue(downloadSummaryStatusAtom);

  const [, setSimplifyLevel] = useState(3);

  const LEVEL_MAX = 4;

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

  const updateStepStatus = (stepIndex: number) => {
    setStepStatus((prevStepStatus) => {
      const newStepStatus = [...prevStepStatus];
      newStepStatus[stepIndex] = StepStatuses.done;
      return newStepStatus;
    });
  };

  const downloadIndexFile = useCallback(async () => {
    const countryMetadataList: GADMGeoJsonCountryMetadata[] =
      await downloadGeoJsonIndexFile();
    setCountryMetadataList(countryMetadataList);

    setSelectedCheckboxMatrix((draft) => {
      draft[0] = new Array<boolean>(LEVEL_MAX + 2).fill(false);
      countryMetadataList.forEach((item, dataIndex) => {
        draft[dataIndex + 1] = new Array<boolean>(item.maxLevel + 2);
        draft[dataIndex + 1].fill(false);
      });
      return draft;
    });

    updateStepStatus(1);

    handleClickNext(1);
  }, []);

  const selectDownloadingFiles = useCallback(() => {
    updateStepStatus(2);
  }, []);

  const onFinishLoadingGeoJsonFiles = useCallback(() => {
    updateStepStatus(3);
  }, []);

  const steps: Step[] = [
    {
      label: 'Step 1: Read and accept the GADM license',
      contents: <Step1DialogContent {...{ handleClick: handleClickNext(0) }} />,
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
      label: 'Step 3: Select countries/levels to download',
      contents: (
        <Step3DialogContent
          {...{
            countryMetadataList,
            LEVEL_MAX,
            numSelected,
            urlListToString,
            onChange: selectDownloadingFiles,
          }}
        />
      ),
      onEnter: async () => {},
      onLeave: async () => {},
    },
    {
      label: 'Step 4: Download files',
      contents: (
        <Step4DialogContent
          {...{ urlList, downloadSummaryStatus, downloadStatus }}
        />
      ),
      onEnter: async () => {
        await downloadGADMGeoJsonFiles(
          countryMetadataList,
          selectedCheckboxMatrix,
          onFinishLoadingGeoJsonFiles,
        );
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
        return navigate('/resources', { replace: true });
      },
    },
  ];

  const isNextButtonDisabled = () => {
    return (
      stepIndex !== 4 &&
      stepIndex !== 5 &&
      stepStatus[stepIndex] !== StepStatuses.done
    );
  };

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
