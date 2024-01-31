import { useLoaderData } from 'react-router-dom';
import { UpsertProjectDialog } from './UpsertProjectDialog';
import { GeoDatabaseTable } from '../../services/database/GeoDatabaseTable';
import {
  DatabaseItemType,
  ProjectType,
} from '../../services/database/ProjectType';

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
        type: type as ProjectType & DatabaseItemType,
        coordinate: [0, 0],
        zoom: 1,
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
    <UpsertProjectDialog
      uuid={uuid}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    />
  );
};
