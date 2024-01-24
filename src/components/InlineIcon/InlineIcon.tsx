import React, { ReactNode } from 'react';

export const InlineIcon = (props: { children: ReactNode }) => {
  return (
    <span
      style={{
        display: 'inline',
        verticalAlign: 'middle',
        margin: '3px',
      }}
    >
      {props.children}
    </span>
  );
};
