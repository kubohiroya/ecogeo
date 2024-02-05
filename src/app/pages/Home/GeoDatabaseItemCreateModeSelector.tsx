import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Outlet, useNavigate } from 'react-router-dom';
import { DOCUMENT_TITLE } from '../../Constants';
import { FileUploadPrompt } from './FileUploadPrompt';
import {
  DatabaseTableTypes,
  GeoDatabaseTableType,
} from '../../services/database/GeoDatabaseTableType';
import { FileDropComponent } from '../../../components/FileDropComponent/FileDropComponent';

const ModelSelectorBox = styled.div`
  display: flex;
  gap: 40px;
  margin-bottom: 5px;
  justify-content: center;
  align-items: center;
`;
const ModelSelectButton = styled(Button)`
  margin-top: 5px;
  padding: 15px;
  display: block;
`;
const IconBox = styled.div`
  margin-top: 10px;
`;

type GeoDatabaseItemCreateModeSelectorItem = {
  icon: React.ReactNode;
  name: string;
  url: string;
  tooltip: string;
};
type GeoDatabaseItemCreateModeSelectorProps = {
  type: GeoDatabaseTableType;
  items: GeoDatabaseItemCreateModeSelectorItem[];
};

const StyledBox = styled.div`
  padding: 80px;
`;

export const GeoDatabaseItemCreateModeSelector = (
  props: GeoDatabaseItemCreateModeSelectorProps,
) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title =
      DOCUMENT_TITLE +
      (props.type === DatabaseTableTypes.resources
        ? ' - Select Resource Type'
        : ' - Select Project Type');
  }, [props.type]);
  return (
    <StyledBox>
      <Typography
        style={{ textAlign: 'center', paddingBottom: '16px', color: '#888' }}
      >
        Please choose type:
      </Typography>
      <ModelSelectorBox>
        {props.items.map(
          (item: GeoDatabaseItemCreateModeSelectorItem, index: number) => (
            <ModelSelectButton
              key={index}
              variant="outlined"
              title={item.tooltip}
              onClick={() => navigate(item.url)}
            >
              <div>{item.name}</div>
              <IconBox>{item.icon}</IconBox>
            </ModelSelectButton>
          ),
        )}
      </ModelSelectorBox>

      <FileDropComponent acceptableSuffixes={['.json', '.csv', '.csv.zip']}>
        <Outlet />
        <FileUploadPrompt />
      </FileDropComponent>
    </StyledBox>
  );
};
