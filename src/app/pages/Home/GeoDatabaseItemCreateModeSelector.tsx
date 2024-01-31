import React, { useEffect } from 'react';
import { Button } from '@mui/material';
import styled from '@emotion/styled';
import { Outlet, useNavigate } from 'react-router-dom';
import { DOCUMENT_TITLE } from '../../Constants';
import { FileUploadPrompt } from './FileUploadPrompt';
import { GeoDatabaseTableType } from './GeoDatabaseTableType';

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

export const GeoDatabaseItemCreateModeSelector = (
  props: GeoDatabaseItemCreateModeSelectorProps,
) => {
  const navigate = useNavigate();
  useEffect(() => {
    document.title =
      DOCUMENT_TITLE +
      (props.type == GeoDatabaseTableType.resources
        ? ' - Select Resource Type'
        : ' - Select Project Type');
  }, []);
  return (
    <div>
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

      <hr />

      <Outlet />

      <FileUploadPrompt />
    </div>
  );
};
