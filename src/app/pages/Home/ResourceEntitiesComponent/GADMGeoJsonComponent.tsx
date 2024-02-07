//import { ResourceEntity, ResourceItems } from '../../models/ResourceEntity';
import { GADMGeoJsonResourceChip } from './GADMGeoJsonResourceChip';
import { ResourceEntity } from 'src/app/models/ResourceEntity';
import { ResourceItem } from 'src/app/models/ResourceItem';

export type GADMGGeoJsonComponentProps = {
  resource: ResourceEntity;
};
export const GADMGeoJsonComponent = (props: GADMGGeoJsonComponentProps) => {
  const resourceItemsMap: Map<string, ResourceItem[]> = new Map();
  const countries: string[] = [];

  props.resource.items.forEach((item) => {
    let items = resourceItemsMap.get(item.countryCode);
    if (!items) {
      items = [];
      countries.push(item.countryCode);
    }
    items.push(item);
    resourceItemsMap.set(item.countryCode, items);
  });

  return countries.map((countryCode, index) => {
    const items = resourceItemsMap.get(countryCode);
    if (items) {
      return (
        <GADMGeoJsonResourceChip
          key={index}
          country={items[0].countryName}
          countryCode={countryCode}
          levels={items.map((items) => items.level)}
          urls={items.map((items) => items.url)}
        />
      );
    }
  });
};
