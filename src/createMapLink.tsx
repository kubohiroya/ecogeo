export function createMapLink(item: {
  uuid: string;
  coordinate: [number, number];
  zoom: number;
}) {
  return `/map/${item.uuid}/${item.zoom}/${item.coordinate[0]}/${item.coordinate[1]}/`;
}
