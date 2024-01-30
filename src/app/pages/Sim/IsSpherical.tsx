import { SessionState } from '../../models/SessionState';

export function isSpherical(sessionState: SessionState) {
  return sessionState.parameterSet.units == 'degrees';
}
