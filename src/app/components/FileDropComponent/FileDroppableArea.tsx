import styled from '@emotion/styled';

// 背景色が変わるコンポーネントのスタイルを定義

interface FileDroppableAreaProps {
  isDragOver: boolean;
  isError: boolean;
}

export const FileDroppableArea = styled.div<FileDroppableAreaProps>`
  align-items: center;
  justify-content: center;

  height: calc(100vh - 20px);

  border: ${(props) =>
    props.isDragOver ? '10px dashed #eee' : '10px solid rgba(255,255,255,0)'};

  background-color: ${(props) =>
    props.isError
      ? '#ff000040'
      : props.isDragOver
        ? '#00ff0010'
        : 'transparent'};
`;
