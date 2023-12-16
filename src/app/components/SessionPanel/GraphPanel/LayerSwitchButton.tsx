import { Backdrop, FormControlLabel, IconButton, Switch } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Public } from '@mui/icons-material';
import { BACKDROP_TIMEOUT_MILLI_SEC } from './Constatns';

interface LayerSwitchButtonProps {
  mapLayer: boolean;
  onChangeMapLayer: (mapLayer: boolean) => void;
}

const ControlButton = styled(IconButton)`
  position: absolute;
  width: 40px;
  height: 40px;
  margin: 0;
  padding: 0;
  left: 10px;
  border-radius: 20px;
  border: 1px solid gray;
`;
const LayerSwitchOpenButton = styled(ControlButton)`
  bottom: 20px;
`;
const StyledSwitch = styled(Switch)``;
const LayerSwitchContainer = styled.div`
  position: absolute;
  width: 120px;
  height: 60px;
  bottom: 10px;
  left: 55px;
  background-color: white;
  border-radius: 20px;
  padding-left: 5px;
  border: 1px solid gray;
  box-shadow: 0 0 1px gray;
`;

export const LayerSwitchButton = (props: LayerSwitchButtonProps) => {
  const [subMenuShown, setSubMenuShown] = useState<boolean>(false);
  return (
    <>
      <LayerSwitchOpenButton
        color={'primary'}
        title={'Show background layer of world map'}
        onClick={() => setSubMenuShown(!subMenuShown)}
      >
        <Public />
      </LayerSwitchOpenButton>
      <Backdrop
        open={subMenuShown}
        onClick={() =>
          setTimeout(() => {
            setSubMenuShown(false);
          }, BACKDROP_TIMEOUT_MILLI_SEC)
        }
        sx={{
          backgroundColor: '#00000030',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <LayerSwitchContainer>
          <FormControlLabel
            control={
              <StyledSwitch
                aria-label="Show background layer of world map"
                checked={props.mapLayer}
                onChange={(event) => {
                  props.onChangeMapLayer(event.target.checked);
                }}
              />
            }
            label={'World map'}
            labelPlacement={'top'}
          ></FormControlLabel>
        </LayerSwitchContainer>
      </Backdrop>

      <></>
    </>
  );
};
