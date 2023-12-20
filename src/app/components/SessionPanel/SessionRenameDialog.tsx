import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';

interface SessionRenameDialogProps {
  open: boolean;
  onClose: () => void;
  onRename: (newName: string) => void;
  name: string;
}

export const SessionRenameDialog = (props: SessionRenameDialogProps) => {
  const [name, setName] = useState<string>(props.name);

  const onCancel = useCallback(() => {
    props.onClose();
  }, [props.onClose]);

  const onRename = useCallback(() => {
    props.onClose();
    props.onRename(name);
  }, [props.onClose, props.onRename, name]);

  const onChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value);
    },
    [setName]
  );

  useEffect(() => {
    setName(props.name);
  }, [props.name]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">Rename</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the new name of the session.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="New name"
          type="text"
          fullWidth
          value={name}
          onChange={onChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onRename}>Rename</Button>
      </DialogActions>
    </Dialog>
  );
};
