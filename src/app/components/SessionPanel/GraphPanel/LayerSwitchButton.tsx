import { Backdrop, FormControlLabel, Switch } from '@mui/material';
import React, { useState } from 'react';
import styled from '@emotion/styled';
import { BACKDROP_TIMEOUT_MILLI_SEC } from './Constatns';
import { Layers } from '@mui/icons-material';
import { OverlayControlButton } from './OverlayControlButton';

interface LayerSwitchButtonProps {
  mapLayer: boolean;
  onChangeMapLayer: (mapLayer: boolean) => void;
}

const LayerSwitchOpenButton = styled(OverlayControlButton)`
  //bottom: 20px;
  top: 10px;
  left: 10px;
`;
const StyledSwitch = styled(Switch)``;
const LayerSwitchContainer = styled.div`
  position: absolute;
  top: 10px;
  left: 110px;
  width: 120px;
  height: 60px;
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
        <Layers />
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
