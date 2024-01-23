import { WorkerTaskRequest } from '../../../worker/WorkerPool';

import { DexieQueryRequestPayload } from './DexieQueryRequestPayload';

export interface DexieQueryRequest extends WorkerTaskRequest {
  payload: DexieQueryRequestPayload;
}
