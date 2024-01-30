import { SessionState } from '../../models/SessionState';

export function isSpherical(sessionState: SessionState) {
  return sessionState.country.units == 'degrees';
}
