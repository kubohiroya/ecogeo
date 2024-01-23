import React from 'react';
import { FullScreenApp } from './FullScreenApp';

//import { ClassicStyleApp } from './ClassicStyleApp';
//const DEFAULT_TYPE = 'real-world';
const DEFAULT_TYPE = 'selector';

export function App(props: {
  type: 'selector' | 'theoretical' | 'real-world';
}) {
  return <FullScreenApp type={props.type} />;
}

export default App;
