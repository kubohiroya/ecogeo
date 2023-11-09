export function hasFeatureDetectingHoverEvent() {
  return window.matchMedia('(hover: hover)').matches;
}
