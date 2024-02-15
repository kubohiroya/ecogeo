export interface GeoRegionSource {
  country: string;
  name_1: string;
  name_2: string;
  name: string;
  coordinates: number[][][][]; // 0: ポリゴン番号 // 1: ポリゴンか穴か // 2: 頂点番号 // 3: x or y
}
