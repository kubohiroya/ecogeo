import {
  ClickAwayListener,
  Grow,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@mui/material';
import React, { useCallback, useRef } from 'react';
import Menu from '@mui/icons-material/Menu';
import { ContentCopy, Delete, Edit } from '@mui/icons-material';
import { GeoDatabaseEntity } from 'src/app/models/GeoDatabaseEntity';
import { useNavigate } from 'react-router-dom';
import { ResourceEntity } from 'src/app/models/ResourceEntity';
import { GeoDatabaseTableType } from 'src/app/models/GeoDatabaseTableType';

interface DatabaseItemMenuProps {
  tableType: GeoDatabaseTableType;
  item: GeoDatabaseEntity | ResourceEntity;
}

export const GeoDatabaseEntityMenu = ({
  tableType,
  item,
}: DatabaseItemMenuProps) => {
  const ref = useRef(null);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleMenuClose = useCallback(() => {
    setOpen(false);
  }, []);

  const openMenu = useCallback(
    (open: boolean) => () => {
      setOpen(open);
    },
    [],
  );

  const handleEdit = useCallback(() => {
    navigate(`/${tableType}/update/${item.type}/${item.uuid}`);
  }, [item.type, item.uuid, navigate, tableType]);

  const handleDelete = useCallback(() => {
    navigate(`/${tableType}/delete/${item.type}/${item.uuid}`);
  }, [item.type, item.uuid, navigate, tableType]);

  return (
    <>
      <IconButton ref={ref} onClick={openMenu(true)}>
        <Menu />
      </IconButton>

      <Popper
        open={open}
        anchorEl={ref.current}
        role={undefined}
        placement="bottom-start"
        transition
        disablePortal
        style={{ zIndex: 1000 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleMenuClose}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  aria-labelledby="composition-button"
                >
                  <MenuItem onClick={handleEdit}>
                    <ListItemIcon>
                      <Edit />
                    </ListItemIcon>
                    <ListItemText>Edit</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleMenuClose} disabled>
                    <ListItemIcon>
                      <ContentCopy />
                    </ListItemIcon>
                    <ListItemText>Duplicate</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                      <Delete />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};
