import { useEffect, useState } from 'react';
import { AbstractMatrixEngine } from 'src/app/apsp/MatrixEngine';
import { createMatrixEngine } from 'src/app/apsp/MatrixEngineService';

export function useMatrixEngine(numLocations: number, numEdges: number) {
  const [matrixEngine, setMatrixEngine] = useState<AbstractMatrixEngine>(
    createMatrixEngine(numLocations, numEdges),
  );

  useEffect(() => {
    setMatrixEngine(createMatrixEngine(numLocations, numEdges));
  }, [numLocations, numEdges]);

  return matrixEngine;
}
