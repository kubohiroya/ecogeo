import { Box } from '@mui/material';
import styled from '@emotion/styled';

const FullScreenRoot = styled(Box)`
  height: calc(100vh - 1px);
  padding: 0;
  margin: 0;
  align-items: center;
  justify-content: space-around;
  overflow: hidden;
  scroll-behavior: unset;
`;
export const FullScreenBox = (props: { children: React.ReactNode }) => {
  return <FullScreenRoot>{props.children}</FullScreenRoot>;
};
