export const StepStatuses = {
  onEnterTask: 0,
  display: 1,
  onLeaveTask: 2,
  done: 3,
} as const;

export type StepStatus = (typeof StepStatuses)[keyof typeof StepStatuses];
