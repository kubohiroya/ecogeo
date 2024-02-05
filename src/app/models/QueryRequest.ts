import { WorkerTaskRequest } from '../../worker/WorkerPool';

export interface QueryRequest<T> extends WorkerTaskRequest {
  payload: T;
}
