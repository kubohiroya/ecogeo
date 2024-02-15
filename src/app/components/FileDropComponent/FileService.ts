import { LoaderProgressResponse } from "~/app/services/file/FileLoaderResponse";
import { atom } from "jotai/index";

type LoadingFiles = Record<string, LoaderProgressResponse>;
export const loadingFilesAtom = atom<LoadingFiles>({});

export function checkAcceptableFileList(
  fileList: FileList,
  acceptableSuffixes: string[],
): boolean[] {
  const results: boolean[] = [];

  // 各ファイルに対してループ
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    const fileName = file.name;
    const fileSuffix = fileName.slice(fileName.lastIndexOf('.'));
    // 拡張子が許容されるサフィックスの配列に含まれるかどうかをチェック
    const isAcceptable = acceptableSuffixes.includes(fileSuffix);
    results.push(isAcceptable);
  }

  return results;
}
