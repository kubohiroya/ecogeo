import { ProjectTableDB } from '../../services/projectTable/ProjectTableDB';
import { ProjectType } from '../../models/ProjectType';

export const createProjectLoader =
  ({ type }: { type: ProjectType }) =>
  async ({ params }: any) => {
    return params.uuid === undefined
      ? { uuid: undefined, type, name: '', description: '' }
      : await ProjectTableDB.getSingleton()
          .projects.where('uuid')
          .equals(params.uuid)
          .last();
  };
