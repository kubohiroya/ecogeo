import styled from '@emotion/styled';
import React from 'react';
import { Typography } from '@mui/material';
import { FileUpload, Quiz } from '@mui/icons-material';

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

export function FileUploadPrompt() {
  return (
    <PromptBox>
      <Typography
        style={{ color: '#bbb', marginLeft: '30px', marginRight: '30px' }}
      >
        If you already have some local files of the types described above, Drag
        and Drop them here!
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
