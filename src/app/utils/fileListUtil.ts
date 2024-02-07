export function convertFileListToFileArray(fileList: FileList) {
  const files = [];
  for (let index = 0; index < fileList.length; index++) {
    const file = fileList.item(index);
    if (file) {
      files.push(file);
    }
  }
  return files;
}
