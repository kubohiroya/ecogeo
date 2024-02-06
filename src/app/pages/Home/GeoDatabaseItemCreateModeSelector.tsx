import React, { useEffect } from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';
import { Outlet, useNavigate } from 'react-router-dom';
import { DOCUMENT_TITLE } from '../../Constants';
import { FileUploadPrompt } from './FileUploadPrompt';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
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
      (props.type === GeoDatabaseTableTypes.resources
        ? ' - Select Resource Type'
        : ' - Select Project Type');
  }, [props.type]);
  return (
    <StyledBox>
      <Typography
        style={{ textAlign: 'center', paddingBottom: '16px', color: '#888' }}
      >
        Create a new{' '}
        {props.type === GeoDatabaseTableTypes.resources
          ? 'resource'
          : 'project'}{' '}
        :
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

      <FileDropComponent
        acceptableSuffixes={['.json', '.csv', '.csv.zip']}
        type={props.type}
      >
        <Outlet />
        <FileUploadPrompt type={props.type} />
      </FileDropComponent>
    </StyledBox>
  );
};
