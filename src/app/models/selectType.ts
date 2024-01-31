export const SelectTypes = {
  SELECTED: 'selected',
  FOCUSED: 'focused',
} as const;

export type SelectType = (typeof SelectTypes)[keyof typeof SelectTypes];
