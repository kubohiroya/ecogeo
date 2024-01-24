import React, { useEffect } from 'react';
import { FileUpload, PsychologyAlt, Public } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Outlet, useNavigate } from 'react-router-dom';
import { ProjectType } from '../../models/ProjectType';
import { DOCUMENT_TITLE } from '../../Constants';

const ModelSelectorBox = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 60px;
  justify-content: center;
  align-items: center;
`;
const ModelSelectButton = styled(Button)`
  margin-top: 40px;
  padding: 40px;
  display: block;
`;
const PromptBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 40px;
  font-size: 20px;
  gap: 10px;
`;
const IconBox = styled.div`
  margin-top: 10px;
`;

export const CreateProjectSelector = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = DOCUMENT_TITLE + ': Select Project Type';
  }, []);
  return (
    <div>
      <ModelSelectorBox>
        <ModelSelectButton
          variant="outlined"
          onClick={() => navigate(`/create/${ProjectType.theoretical}`)}
        >
          <div>Theoretical Model</div>
          <IconBox>
            <PsychologyAlt fontSize="large" />
          </IconBox>
        </ModelSelectButton>

        <ModelSelectButton
          variant="outlined"
          onClick={() => navigate(`/create/${ProjectType.realWorld}`)}
        >
          <div>Real-World Model</div>
          <IconBox>
            <Public fontSize="large" />
          </IconBox>
        </ModelSelectButton>
      </ModelSelectorBox>
      <hr />

      <Outlet />

      <PromptBox>
        <Typography>Drag files here!</Typography>
        <FileUpload fontSize="large" />
      </PromptBox>
    </div>
  );
};
