import styled from '@emotion/styled';
import { useAtom } from 'jotai/index';
import React, { useCallback } from 'react';
import { FloatingPanel, FloatingPanelState } from '../../FloatingPanel';
import {
  Flag,
  Folder,
  Hexagon,
  Layers,
  LocationCity,
  Route,
  Search,
  Square,
} from '@mui/icons-material';
import { Box, Button, IconButton, Input } from '@mui/material';
import { TreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledTreeItem } from '../../../components/TreeView/StyledTreeItem';
import { atomWithImmer, withImmer } from 'jotai-immer';
import { focusAtom } from 'jotai-optics';
import useMousePresence from '../../hooks/useMousePresence';

const SearchField = styled(Input)`
  position: absolute;
  top: 0;
  right: 30px;
  font-size: 14px;
  background-color: rgba(255, 255, 255, 0.6);
  width: 270px;
  height: 20px;
  padding-top: 3px;
  margin-top: 7px;
`;
const EdgeButton = styled(IconButton)`
  position: absolute;
  background-color: rgba(255, 255, 255, 0.6);
`;
const RightEdgeButton = styled(EdgeButton)`
  right: 0;
  border-radius: 10px 0 0 10px;
  border-right: 5px solid rgba(0, 0, 0, 0);
`;
const LeftEdgeButton = styled(EdgeButton)`
  left: 0;
  border-radius: 0 10px 10px 0;
  border-left: 5px solid rgba(0, 0, 0, 0);
`;
const SearchEdgeButton = styled(LeftEdgeButton)`
  top: 10px;
`;
const FileEdgeButton = styled(LeftEdgeButton)`
  top: 50px;
`;
const LayerEdgeButton = styled(LeftEdgeButton)`
  top: 90px;
`;
export const floatingPanelStateAtom = atomWithImmer<
  Record<string, FloatingPanelState>
>({
  search: {
    open: true,
    x: 5,
    y: 10,
    z: 100,
    width: 405,
    height: 32,
    minimize: false,
  },
  file: {
    open: false,
    x: 5,
    y: 50,
    z: 101,
    width: 400,
    height: 100,
    minimize: false,
  },
  layer: {
    open: false,
    x: 5,
    y: 90,
    z: 102,
    width: 400,
    height: 250,
    minimize: false,
  },
});
export const searchAtom = withImmer(
  focusAtom(floatingPanelStateAtom, (optic) => optic.prop('search')),
);
export const fileAtom = withImmer(
  focusAtom(floatingPanelStateAtom, (optic) => optic.prop('file')),
);
export const layerAtom = withImmer(
  focusAtom(floatingPanelStateAtom, (optic) => optic.prop('layer')),
);
export const FloatingPanelButtonGroup = () => {
  const { isMouseInside } = useMousePresence();
  const [, setPanelState] = useAtom(floatingPanelStateAtom);
  const [searchState, setSearchState] = useAtom(searchAtom);
  const [fileState, setFileState] = useAtom(fileAtom);
  const [layerState, setLayerState] = useAtom(layerAtom);

  const showPanel = useCallback(
    (id: string, open: boolean) => () => {
      const func =
        id == 'search'
          ? setSearchState
          : id == 'file'
            ? setFileState
            : setLayerState;
      func((draft) => {
        draft.open = open;
      });
    },
    [setSearchState, setFileState, setLayerState],
  );

  return (
    isMouseInside && (
      <>
        {!searchState.open && (
          <SearchEdgeButton size={'small'} onClick={showPanel('search', true)}>
            <Search />
          </SearchEdgeButton>
        )}{' '}
        {!fileState.open && (
          <FileEdgeButton size={'small'} onClick={showPanel('file', true)}>
            <Folder />
          </FileEdgeButton>
        )}{' '}
        {!layerState.open && (
          <LayerEdgeButton size={'small'} onClick={showPanel('layer', true)}>
            <Layers />
          </LayerEdgeButton>
        )}
      </>
    )
  );
};
export const FloatingPanelGroup = () => {
  const [, setPanelState] = useAtom(floatingPanelStateAtom);
  const [searchState, setSearchState] = useAtom(searchAtom);
  const [fileState, setFileState] = useAtom(fileAtom);
  const [layerState, setLayerState] = useAtom(layerAtom);

  const showPanel = useCallback(
    (id: string, open: boolean) => () => {
      const func =
        id == 'search'
          ? setSearchState
          : id == 'file'
            ? setFileState
            : setLayerState;
      func((draft) => {
        draft.open = open;
      });
    },
    [setSearchState, setFileState, setLayerState],
  );

  const bringToFront = useCallback(
    (id: string) => {
      setPanelState((draft) => {
        const maxZ = Object.values(draft)
          .map((value) => value.z)
          .reduce((prev, current) => (prev > current ? prev : current), 0);

        Object.values(draft).map((value) => {
          if (value.z > draft[id].z) {
            value.z -= 1;
          }
          return value;
        });
        draft[id].z = maxZ;
      });
    },
    [setPanelState],
  );

  return (
    <div>
      {[
        <FloatingPanel
          key={'search'}
          id={'search'}
          title={'Search'}
          icon={<Search />}
          open={searchState.open}
          zIndex={searchState.z}
          onClick={bringToFront}
          onClose={showPanel('search', false)}
          titleBarMode={true}
        >
          <SearchField id="search" type="search" size="small" margin="none" />
        </FloatingPanel>,
        <FloatingPanel
          key={'file'}
          id={'file'}
          open={fileState.open}
          zIndex={fileState.z}
          icon={<Folder />}
          title="I/O Actions"
          onClick={bringToFront}
          onClose={showPanel('file', false)}
        >
          <Box
            style={{
              gap: '8px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button variant={'contained'}>Import...</Button>
            <Button variant={'contained'}>Export...</Button>
          </Box>
        </FloatingPanel>,
        <FloatingPanel
          key={'layer'}
          id={'layer'}
          open={layerState.open}
          zIndex={layerState.z}
          icon={<Layers />}
          title="Layer Panels"
          onClick={bringToFront}
          onClose={showPanel('layer', false)}
        >
          <TreeView
            defaultCollapseIcon={<ExpandMoreIcon />}
            defaultExpandIcon={<ChevronRightIcon />}
            defaultExpanded={['1', '2']}
          >
            <StyledTreeItem
              nodeId="1"
              level={1}
              labelText="Country Shapes"
              labelIcon={Flag}
            >
              <StyledTreeItem
                nodeId="1-1"
                level={2}
                labelText="Region1 Shapes"
                labelIcon={Hexagon}
              >
                <StyledTreeItem
                  nodeId="1-1-1"
                  level={3}
                  labelText="Region2 Shapes"
                  labelIcon={Square}
                />
              </StyledTreeItem>
            </StyledTreeItem>
            <StyledTreeItem
              nodeId="2"
              level={1}
              labelText="Cities"
              labelIcon={LocationCity}
            />
            <StyledTreeItem
              nodeId="3"
              level={1}
              labelText="Routes"
              labelIcon={Route}
            />
          </TreeView>
        </FloatingPanel>,
      ].sort((a, b) => a.props.zIndex - b.props.zIndex)}
    </div>
  );
};
