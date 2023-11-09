export function fitToParent(element: HTMLCanvasElement) {
  // WORKAROUND
  element.width = 0;
  element.height = 0;
  element.style.width = '0';
  element.style.height = '0';

  // parent element is the .canvas-wrapper
  const parentWidth = element.parentElement!.clientWidth;
  const parentHeight = element.parentElement!.clientHeight;

  // for debug
  //console.log('Wrapper size = ' + parentWidth + 'x' + parentHeight + ' Canvas size = ' + size + 'x' + size);

  element.width = parentWidth;
  element.height = parentHeight;
  element.style.width = parentWidth + 'px';
  element.style.height = parentHeight + 'px';
  return [parentWidth, parentHeight];
}
