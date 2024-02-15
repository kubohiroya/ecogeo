export interface WorkerTaskRequest {
  type: string;
  id: number;
  payload: unknown;
}

export type WorkerWrapper = {
  worker: Worker;
  workerConstructor: new () => Worker;
  currentTaskId: number | null;
};

export class WorkerPool<T extends WorkerTaskRequest, R> {
  private pool: WorkerWrapper[] = [];
  private taskQueue: T[] = [];
  private onResult: (e: R) => void;

  constructor(
    workerConstructor: new () => Worker,
    poolSize: number,
    onResult: (e: R) => void,
  ) {
    this.onResult = onResult;
    for (let i = 0; i < poolSize; i++) {
      this.addWorkerToPool(workerConstructor);
    }
  }

  private addWorkerToPool(workerConstructor: new () => Worker): void {
    const worker = new workerConstructor();
    worker.onerror = (event: ErrorEvent) => {
      console.error(event);
    };

    worker.onmessage = (event: MessageEvent) => {
      const index = this.pool.findIndex((w) => w.worker === worker);
      if (index !== -1) {
        this.pool[index].currentTaskId = null;
        const result = event.data as unknown as R;
        console.log(event);
        this.onResult(result);
        this.executeNextTask();
      }
    };
    this.pool.push({ worker, workerConstructor, currentTaskId: null });
  }

  executeTask(task: T): void {
    this.taskQueue.push(task);
    this.executeNextTask();
  }

  private executeNextTask(): void {
    const availableWorker = this.pool.find((w) => w.currentTaskId === null);
    if (availableWorker && this.taskQueue.length > 0) {
      const task = this.taskQueue.shift()!;
      availableWorker.currentTaskId = task.id;
      availableWorker.worker.postMessage({
        ...task,
        payload: JSON.stringify(task.payload),
      });
    }
  }

  terminateTask(taskId: number): void {
    const workerIndex = this.pool.findIndex((w) => w.currentTaskId === taskId);
    if (workerIndex !== -1) {
      const worker = this.pool[workerIndex];
      worker.worker.terminate();
      this.pool.splice(workerIndex, 1);
      this.addWorkerToPool(worker.workerConstructor);
    }
  }

  terminateAllTasks(): void {
    this.pool.forEach((w) => w.worker.terminate());
    this.pool = [];
  }
}
