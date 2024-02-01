export function createProjectLink(item: {
  type: string;
  uuid: string;
  viewportCenter?: [number, number, number] | undefined;
}) {
  if (!item.viewportCenter) {
    return `/${item.type}/${item.uuid}/1/0/0/`;
  } else {
    return `/${item.type}/${item.uuid}/${item.viewportCenter[0]}/${item.viewportCenter[1]}/${item.viewportCenter[2]}/`;
  }
}
