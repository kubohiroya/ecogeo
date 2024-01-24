import { useLoaderData } from 'react-router-dom';
import { UpsertProjectDialog } from './UpsertProjectDialog';
import { ProjectTableDB } from '../../services/projectTable/ProjectTableDB';
import { ProjectType } from '../../models/ProjectType';

export const UpsertTheoreticalProjectDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: ProjectType;
    name: string | undefined;
    description: string | undefined;
  };

  const onSubmit = async (value: {
    uuid: string | undefined;
    type: ProjectType;
    name: string;
    description: string;
  }) => {
    if (!uuid) {
      await ProjectTableDB.createProject({
        ...value,
        type,
        coordinate: [0, 0],
        zoom: 1,
        version: 1,
        createdAt: Date.now(),
      });
    } else {
      await ProjectTableDB.updateProject(uuid, {
        ...value,
      });
    }
  };

  return (
    <UpsertProjectDialog
      uuid={uuid}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
