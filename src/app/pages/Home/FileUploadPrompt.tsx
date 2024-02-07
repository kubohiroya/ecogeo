import styled from '@emotion/styled';
import React from 'react';
import { Typography } from '@mui/material';
import { FileUpload, Quiz } from '@mui/icons-material';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
} from 'src/app/models/GeoDatabaseTableType';

const PromptBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 10px;
  font-size: 20px;
  gap: 10px;
  padding: 10px;
`;

export function FileUploadPrompt({ type }: { type: GeoDatabaseTableType }) {
  return (
    <PromptBox>
      <Typography
        style={{ color: '#bbb', marginLeft: '30px', marginRight: '30px' }}
      >
        Otherwise, drag and drop your local data files here to upload and create
        a new {type === GeoDatabaseTableTypes.projects ? 'project' : 'resource'}
        .
      </Typography>

      <FileUpload fontSize="large" />

      <Quiz
        fontSize="large"
        style={{
          fontSize: '35px',
        }}
      />
    </PromptBox>
  );
}
