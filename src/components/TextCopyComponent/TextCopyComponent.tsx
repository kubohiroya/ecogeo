import React, { useCallback, useState } from 'react';
import { Check, ContentCopy, ReportProblem } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';

export const TextCopyComponent = ({ text }: { text: string }) => {
  const [copyResult, setCopyResult] = useState<boolean | null>(null);
  const copyTextToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyResult(true);
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyResult(false);
    }
  }, [text]);

  return (
    <IconButton onClick={copyTextToClipboard}>
      <Typography>
        <ContentCopy />
        {copyResult === null ? null : copyResult ? (
          <Check />
        ) : (
          <ReportProblem />
        )}
      </Typography>
    </IconButton>
  );
};
