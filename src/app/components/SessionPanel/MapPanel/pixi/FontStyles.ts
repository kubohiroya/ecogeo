import { TextStyle } from 'pixi.js';

export const StyleSize14 = new TextStyle({
  fontSize: 14,
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fill: '#333333',
  align: 'center',
});
export const StyleSize14Focused = new TextStyle({
  fontSize: 14,
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  fill: '#dd0000',
  align: 'center',
});

export const StyleSize11 = new TextStyle({
  fontSize: 11,
  fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
  align: 'center',
  fill: '#333333',
});

export const fontStyle = (style: Object) =>
  new TextStyle({
    fontSize: 11,
    fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
    fill: '#333333',
    align: 'center',
    ...style,
  });
