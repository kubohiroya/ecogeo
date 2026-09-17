import { CardContent, RadioGroup } from '@mui/material';
import { TreeView } from '@mui/x-tree-view';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { StyledTreeItem } from 'src/components/TreeView/StyledTreeItem';
import { Map, Flag, LocationCity, Route } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import {
  GADMGeoJsonResourceEntity,
  IdeGsmCitiesResourceEntity,
  IdeGsmRoutesResourceEntity,
  MapTileResourceEntity,
  ResourceEntity,
} from '~/app/models/ResourceEntity';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { ResourceTypes } from '~/app/models/ResourceType';
import { GeoDatabase } from '~/app/services/database/GeoDatabase';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';

export const LayersPanelComponent = ({ uuid }: { uuid: string }) => {
  const [mapTileResourceEntities, setMapTileResourceEntities] = useState<
    MapTileResourceEntity[]
  >([]);

  const [gadmGeoJsonResourceEntities, setGadmGeoJsonResourceEntities] =
    useState<GADMGeoJsonResourceEntity[]>([]);

  const [ideGsmCitiesResourceEntities, setIdeGsmCitiesResourceEntities] =
    useState<IdeGsmCitiesResourceEntity[]>([]);

  const [ideGsmRoutesResourceEntities, setIdeGsmRoutesResourceEntities] =
    useState<IdeGsmRoutesResourceEntity[]>([]);

  const [selectedMapTileUuid, setSelectedMapTileUuid] = useState<string>('');
  const [selectedGADMGeoJsonUuid, setSelectedGADMGeoJsonUuid] = useState<
    Record<string, GADMGeoJsonResourceEntity>
  >({});

  function updateTreeView() {
    GeoDatabaseTable.getSingleton()
      .resources.where('type')
      .equals(ResourceTypes.mapTiles)
      .toArray()
      .then((mapTilerApiKeyResourceEntities: ResourceEntity[]) => {
        setMapTileResourceEntities(
          mapTilerApiKeyResourceEntities as unknown as MapTileResourceEntity[],
        );
      });
    GeoDatabase.openWithUUID(GeoDatabaseTableTypes.resources, uuid).then(
      (db) => {
        db.resources
          .where('type')
          .equals(ResourceTypes.mapTiles)
          .last()
          .then((resourceEntity: ResourceEntity | undefined) => {
            resourceEntity?.uuid &&
              setSelectedMapTileUuid(resourceEntity?.uuid);
          });
      },
    );

    GeoDatabaseTable.getSingleton()
      .resources.where('type')
      .equals(ResourceTypes.gadmGeoJson)
      .toArray()
      .then((gadmGeoJsonResourceEntities: ResourceEntity[]) => {
        setGadmGeoJsonResourceEntities(
          gadmGeoJsonResourceEntities as unknown as GADMGeoJsonResourceEntity[],
        );
      });
    GeoDatabase.openWithUUID(GeoDatabaseTableTypes.resources, uuid).then(
      (db) => {
        db.resources
          .where('type')
          .equals(ResourceTypes.gadmGeoJson)
          .last()
          .then((resourceEntity: ResourceEntity | undefined) => {
            resourceEntity?.uuid &&
              setSelectedGADMGeoJsonUuid({
                ...selectedGADMGeoJsonUuid,
                [resourceEntity?.uuid]:
                  resourceEntity as GADMGeoJsonResourceEntity,
              });
          });
      },
    );

    GeoDatabaseTable.getSingleton()
      .resources.where('type')
      .equals(ResourceTypes.idegsmCities)
      .toArray()
      .then((ideGsmCitiesResourceEntities: ResourceEntity[]) => {
        setIdeGsmCitiesResourceEntities(
          ideGsmCitiesResourceEntities as unknown as IdeGsmCitiesResourceEntity[],
        );
      });
    GeoDatabaseTable.getSingleton()
      .resources.where('type')
      .equals(ResourceTypes.idegsmRoutes)
      .toArray()
      .then((ideGsmRoutesResourceEntities: ResourceEntity[]) => {
        setIdeGsmRoutesResourceEntities(
          ideGsmRoutesResourceEntities as unknown as IdeGsmRoutesResourceEntity[],
        );
      });
  }

  useEffect(() => {
    GeoDatabaseTable.getSingleton().on('changes', () => {
      updateTreeView();
    });
    updateTreeView();
  }, []);

  useEffect(() => {
    console.log('*', mapTileResourceEntities, gadmGeoJsonResourceEntities);
  }, [mapTileResourceEntities, gadmGeoJsonResourceEntities]);

  return (
    <CardContent
      style={{
        height: '300px',
        overflowY: 'scroll',
        // backgroundColor: 'red',
      }}
    >
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        defaultExpanded={[
          ResourceTypes.mapTiles,
          ResourceTypes.gadmGeoJson,
          ResourceTypes.idegsmCities,
          ResourceTypes.idegsmRoutes,
        ]}
      >
        <StyledTreeItem
          nodeId={ResourceTypes.mapTiles}
          level={1}
          labelText="MapTile"
          labelIcon={Map}
        >
          <RadioGroup
            value={selectedMapTileUuid}
            name="mapTileOptionGroup"
            onChange={(event) => {
              setSelectedMapTileUuid(event.target.value);
            }}
          >
            {mapTileResourceEntities.map((mapTileResourceEntity) => (
              <StyledTreeItem
                key={mapTileResourceEntity.uuid}
                nodeId={mapTileResourceEntity.uuid}
                level={2}
                labelText={mapTileResourceEntity.name}
                labelIcon={Map}
                value={mapTileResourceEntity.uuid}
                type={'radio'}
              />
            ))}
          </RadioGroup>
        </StyledTreeItem>

        <StyledTreeItem
          nodeId={ResourceTypes.gadmGeoJson}
          level={1}
          labelText="GADM GeoJson"
          labelIcon={Flag}
        >
          {gadmGeoJsonResourceEntities.map((gadmGeoJsonResourceEntity) => (
            <StyledTreeItem
              key={gadmGeoJsonResourceEntity.uuid}
              nodeId={gadmGeoJsonResourceEntity.uuid}
              level={2}
              labelText={gadmGeoJsonResourceEntity.name}
              labelIcon={Flag}
              type={'checkbox'}
            />
          ))}
        </StyledTreeItem>
        <StyledTreeItem
          nodeId={ResourceTypes.idegsmCities}
          level={1}
          labelText="Cities"
          labelIcon={LocationCity}
        >
          {ideGsmCitiesResourceEntities.map((ideGsmCitiesResourceEntity) => (
            <StyledTreeItem
              key={ideGsmCitiesResourceEntity.uuid}
              nodeId={ideGsmCitiesResourceEntity.uuid}
              level={2}
              labelText={ideGsmCitiesResourceEntity.name}
              labelIcon={LocationCity}
              type={'checkbox'}
            />
          ))}
        </StyledTreeItem>
        <StyledTreeItem
          nodeId={ResourceTypes.idegsmRoutes}
          level={1}
          labelText="Routes"
          labelIcon={Route}
        >
          {ideGsmRoutesResourceEntities.map((ideGsmRoutesResourceEntity) => (
            <StyledTreeItem
              key={ideGsmRoutesResourceEntity.uuid}
              nodeId={ideGsmRoutesResourceEntity.uuid}
              level={2}
              labelText={ideGsmRoutesResourceEntity.name}
              labelIcon={Route}
              type={'checkbox'}
            />
          ))}
        </StyledTreeItem>
      </TreeView>
    </CardContent>
  );
};
