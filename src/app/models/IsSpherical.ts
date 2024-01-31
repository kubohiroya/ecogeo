import { SessionState } from './SessionState';

export function isSpherical(sessionState: SessionState) {
  return sessionState.parameterSet.units === 'degrees';
}
