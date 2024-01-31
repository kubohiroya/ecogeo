import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import {
  DatabaseItemTypes,
  ProjectTypes,
} from '../../services/database/ProjectType';
import { LoaderFunctionArgs } from 'react-router-dom';

export async function GeoDatabaseItemLoader(request: LoaderFunctionArgs) {
  const resources = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .equals(DatabaseItemTypes.resource)
    .toArray();
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([ProjectTypes.racetrack, ProjectTypes.graph, ProjectTypes.realWorld])
    .toArray();

  return {
    resources,
    projects,
  };
}
