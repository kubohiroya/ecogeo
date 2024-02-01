import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { ProjectTypes } from '../../services/database/ProjectType';
import { LoaderFunctionArgs } from 'react-router-dom';
import { GeoDatabaseEntity } from '../../services/database/GeoDatabaseEntity';

export async function ProjectItemLoader(
  request: LoaderFunctionArgs | undefined,
): Promise<{ projects: GeoDatabaseEntity[] }> {
  const projects = await GeoDatabaseTable.getSingleton()
    .databases.where('type')
    .anyOf([ProjectTypes.Racetrack, ProjectTypes.Graph, ProjectTypes.RealWorld])
    .toArray();

  return {
    projects,
  };
}
