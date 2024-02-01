import { useLoaderData } from 'react-router-dom';
import { UpsertDatabaseItemDialog } from '../DatabaseItemMenu/UpsertDatabaseItemDialog';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import { ProjectType } from '../../services/database/ProjectType';
import { ResourceType } from '../../models/ResourceEntity';

export const UpsertTheoreticalProjectDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: string;
    name: string | undefined;
    description: string | undefined;
  };

  const onSubmit = async (values: {
    uuid: string | undefined;
    type: string;
    name: string;
    description: string;
  }) => {
    if (!uuid) {
      await GeoDatabaseTable.createDatabase({
        ...values,
        type: type as ProjectType & ResourceType,
        viewportCenter: [1, 0, 0],
        urls: [],
        version: 1,
        createdAt: Date.now(),
      });
    } else {
      await GeoDatabaseTable.updateDatabase(uuid, {
        ...values,
      });
    }
  };

  return (
    <UpsertDatabaseItemDialog
      uuid={uuid}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
