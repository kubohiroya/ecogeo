import { WorkerTaskRequest } from "~/app/worker/WorkerPool";

export interface QueryRequest<T> extends WorkerTaskRequest {
  payload: T;
}
