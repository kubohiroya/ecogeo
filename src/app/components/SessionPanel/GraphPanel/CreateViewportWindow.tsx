export const createViewportWindow = (props: {
  left: number;
  top: number;
  right: number;
  bottom: number;
  screenWidth: number;
  screenHeight: number;
  paddingMarginRatio: number;
}) => {
  const centerX = (props.left + props.right) / 2;
  const centerY = (props.top + props.bottom) / 2;
  const scaleX =
    (props.screenWidth / (props.right - props.left)) * props.paddingMarginRatio;
  const scaleY =
    (props.screenHeight / (props.bottom - props.top)) *
    props.paddingMarginRatio;
  const scale = Math.min(scaleX, scaleY);
  return { centerX, centerY, scale };
};
