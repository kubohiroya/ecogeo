import { WorkerTaskRequest } from 'src/app/worker/WorkerPool';

export interface QueryRequest<T> extends WorkerTaskRequest {
  payload: T;
}
