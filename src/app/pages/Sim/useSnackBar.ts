import { useCallback, useState } from 'react';

export function useSnackBar() {
  const [snackBarState, setSnackBarState] = useState<{
    open: boolean;
    vertical: 'top' | 'bottom';
    horizontal: 'left' | 'center' | 'right';
    message: string;
  }>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    message: '',
  });

  const openSnackBar = useCallback(
    (message: string) => {
      setSnackBarState({ ...snackBarState, open: true, message });
    },
    [snackBarState, setSnackBarState],
  );

  const closeSnackBar = useCallback(() => {
    setSnackBarState({ ...snackBarState, open: false });
  }, [snackBarState, setSnackBarState]);

  return { openSnackBar, closeSnackBar };
}
