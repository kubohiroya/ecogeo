import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import {
  DatabaseItemTypes,
  ProjectTypes,
} from '../../services/database/ProjectType';
import { LoaderFunctionArgs } from 'react-router-dom';

export async function GeoDatabaseItemLoader(request: LoaderFunctionArgs) {
  const resources = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .equals(DatabaseItemTypes.Resource)
    .toArray();
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([ProjectTypes.Racetrack, ProjectTypes.Graph, ProjectTypes.RealWorld])
    .toArray();

  return {
    resources,
    projects,
  };
}
