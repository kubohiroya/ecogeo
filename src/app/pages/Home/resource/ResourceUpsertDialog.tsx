import { useLoaderData } from 'react-router-dom';
import { GeoDatabaseTable } from '~/app/services/database/GeoDatabaseTable';
import { GeoDatabaseTableTypes } from '~/app/models/GeoDatabaseTableType';
import React, { useCallback } from 'react';
import { DialogContent, FormControl, TextField } from '@mui/material';
import { GeoDatabaseEntityUpsertDialog } from '~/app/pages/Home/GeoDatabaseEntityUpsertDialog';

export const ResourceUpsertDialog = () => {
  const { uuid, type, name, description } = useLoaderData() as {
    uuid: string | undefined;
    type: string;
    name: string | undefined;
    description: string | undefined;
  };

  const onSubmit = useCallback(
    async (values: {
      uuid: string | undefined;
      type: string;
      formData: FormData;
    }) => {
      const formJson = Object.fromEntries(
        (values.formData as any).entries(),
      ) as {
        name: string;
        description: string;
      };

      if (!uuid) {
        await GeoDatabaseTable.createResource({
          ...formJson,
          type,
          items: [],
          version: 1,
          createdAt: Date.now(),
        });
      } else {
        await GeoDatabaseTable.updateResource(uuid, {
          ...formJson,
        });
      }
    },
    [type, uuid],
  );

  return (
    <GeoDatabaseEntityUpsertDialog
      uuid={uuid}
      tableType={GeoDatabaseTableTypes.resources}
      type={type}
      name={name}
      description={description}
      onSubmit={onSubmit}
    >
      <DialogContent>
        Please enter the name and description of the project.
        <FormControl style={{ display: 'flex' }}>
          <TextField
            name="name"
            autoComplete="off"
            defaultValue={name}
            label="Name"
            autoFocus
            required
            fullWidth
            margin="dense"
          />
          <TextField
            autoComplete="off"
            name={'description'}
            defaultValue={description}
            label="Description"
            multiline={true}
            rows={8}
            fullWidth
            margin="dense"
          />
        </FormControl>
      </DialogContent>
    </GeoDatabaseEntityUpsertDialog>
  );
};
