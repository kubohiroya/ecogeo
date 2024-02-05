import { ResourceEntity } from '../../models/ResourceEntity';

export class ResourceEntityBuilder {
  public static buildResourceEntity = (
    resource: ResourceEntity,
  ): ResourceEntity => {
    return {
      ...resource,
    };
  };
}
