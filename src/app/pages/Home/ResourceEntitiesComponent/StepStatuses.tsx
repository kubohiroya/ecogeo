export const StepStatuses = {
  onEnterTask: 0,
  display: 1,
  processing: 2,
  done: 3,
  onLeaveTask: 4,
} as const;

export type StepStatus = (typeof StepStatuses)[keyof typeof StepStatuses];
