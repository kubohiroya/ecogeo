import Dexie from 'dexie';
import * as uuid from 'uuid';
import { GeoPointEntity } from 'src/app/models/geo/GeoPointEntity';
import { GeoRegionEntity } from 'src/app/models/geo/GeoRegionEntity';
import { GeoRouteSegmentEntity } from 'src/app/models/geo/GeoRouteSegmentEntity';
import { GeoRouteSegmentSource } from 'src/app/models/geo/GeoRouteSegmentSource';
import {
  getTilesMortonNumbersForAllZoomsMap,
  MAX_ZOOM_LEVEL,
} from 'src/app/utils/mortonNumberUtil';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
} from 'src/app/services/database/GeoDatabaseTableType';
import { TABLE_DB_NAME } from 'src/app/Constants';

const zoomLevels = 'z0, z1, z2, z3, z4, z5, z6, z7, z8, z9, z10';
const zoomLevelsExt = 'z0_, z1_, z2_, z3_, z4_, z5_, z6_, z7_, z8_, z9_, z10_';

export class GeoDatabase extends Dexie {
  public countries: Dexie.Table<GeoRegionEntity, number>;
  public regions1: Dexie.Table<GeoRegionEntity, number>;
  public regions2: Dexie.Table<GeoRegionEntity, number>;
  public points: Dexie.Table<GeoPointEntity, number>;
  public routeSegments: Dexie.Table<GeoRouteSegmentEntity, number>;

  public constructor(name: string) {
    super(name);
    this.version(8).stores({
      countries: '++id, name, &gid_0, ' + zoomLevels + ',' + zoomLevelsExt,
      regions1:
        '++id, name, resourceIdRef, &[gid_0+gid_1], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt,
      regions2:
        '++id, resourceIdRef, name, &[gid_0+gid_1+gid_2], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt,
      points:
        '++id, resourceIdRef, type, country, name_1, name, &[country+name_1+name], ' +
        zoomLevels,
      routeSegments:
        '++id, resourceIdRef, mode, sourceCountry, sourceName1, sourceName2, sourceName, targetCountry, targetName1, targetName2, targetName, sourceIdRef, targetIdRef, &[sourceIdRef+targetIdRef], ' +
        zoomLevels +
        ',' +
        zoomLevelsExt,
    });

    this.countries = this.table('countries');
    this.regions1 = this.table('regions1');
    this.regions2 = this.table('regions2');
    this.points = this.table('points');
    this.routeSegments = this.table('routeSegments');
  }

  public static async openWithUUID(
    type: GeoDatabaseTableType,
    uuid: string,
  ): Promise<GeoDatabase> {
    switch (type) {
      case GeoDatabaseTableTypes.resources:
        return new GeoDatabase(`${TABLE_DB_NAME}-resource-${uuid}`);
      case GeoDatabaseTableTypes.projects:
        return new GeoDatabase(`${TABLE_DB_NAME}-project-${uuid}`);
      default:
        throw new Error('invalid type:' + type);
    }
  }

  async findAllGeoRegions(mortonNumbers: number[][][], zoom: number) {
    const targetTables =
      0 <= zoom && zoom <= 2
        ? [this.countries]
        : zoom <= 4
          ? [this.countries, this.regions1]
          : [this.regions1, this.regions2];

    return Promise.all(
      targetTables.map(async (db) => {
        const promises: Promise<GeoRegionEntity[]>[] = [];
        for (let z = zoom; z >= 0; z--) {
          if (mortonNumbers[zoom].length === 1) {
            promises.push(
              db.where(`z${zoom}`).anyOf(mortonNumbers[zoom][0]).toArray(),
            );
            if (mortonNumbers[zoom][0].length === 1) {
              break;
            }
          } else {
            promises.push(
              db
                .where(`z${zoom}`)
                .anyOf(
                  mortonNumbers[zoom].length === 2
                    ? mortonNumbers[zoom][0].concat(mortonNumbers[zoom][1])
                    : mortonNumbers[zoom][0],
                )
                .toArray(),
            );
          }
        }
        return Promise.all(promises);
      }),
    );
  }

  async findAllGeoPoints(mortonNumbers: number[][][], zoom: number) {
    const table = this.points;
    const promises: Promise<GeoPointEntity[]>[] = [];
    for (let z = zoom; z >= 0; z--) {
      if (mortonNumbers[zoom].length === 1) {
        promises.push(
          table.where(`z${zoom}`).anyOf(mortonNumbers[zoom][0]).toArray(),
        );
        if (mortonNumbers[zoom][0].length === 1) {
          break;
        }
      } else {
        promises.push(
          table
            .where(`z${zoom}`)
            .anyOf(
              mortonNumbers[zoom].length === 2
                ? mortonNumbers[zoom][0].concat(mortonNumbers[zoom][1])
                : mortonNumbers[zoom][0],
            )
            .toArray(),
        );
      }
    }
    return Promise.all(promises);
  }

  async findAllGeoLineStrings(mortonNumbers: number[][][], zoom: number) {
    const table = this.routeSegments;
    const promises: Promise<GeoRouteSegmentEntity[]>[] = [];
    for (let z = zoom; z >= 0; z--) {
      if (mortonNumbers[zoom].length === 1) {
        promises.push(
          table.where(`z${zoom}`).anyOf(mortonNumbers[zoom][0]).toArray(),
        );
        if (mortonNumbers[zoom][0].length === 1) {
          break;
        }
      } else {
        promises.push(
          table
            .where(`z${zoom}`)
            .anyOf(
              mortonNumbers[zoom].length === 2
                ? mortonNumbers[zoom][0].concat(mortonNumbers[zoom][1])
                : mortonNumbers[zoom][0],
            )
            .toArray(),
        );
      }
    }
    return Promise.all(promises);
  }

  async storeGISRouteSegment(
    segmentSources: GeoRouteSegmentSource[],
  ): Promise<void> {
    const records: GeoRouteSegmentEntity[] = await Promise.all(
      segmentSources.map(async (segmentSource: GeoRouteSegmentSource) => {
        const {
          sourceCountry,
          sourceName1,
          sourceName2,
          sourceName,
          targetCountry,
          targetName1,
          targetName2,
          targetName,
        } = segmentSource;

        const source = await this.findGISPoint({
          country: sourceCountry,
          name_1: sourceName1,
          name_2: sourceName2,
          name: sourceName,
        });
        const target = await this.findGISPoint({
          country: targetCountry,
          name_1: targetName1,
          name_2: targetName2,
          name: targetName,
        });

        if (
          source === undefined ||
          target === undefined ||
          source.id === undefined ||
          target.id === undefined
        )
          throw new Error();

        const [north, south] =
          source.lat > target.lat
            ? [source.lat, target.lat]
            : [target.lat, source.lat];
        const [east, west] =
          source.lng > target.lng
            ? [source.lng, target.lng]
            : [target.lng, source.lng];

        const mortonNumbersByZoomLevels = getTilesMortonNumbersForAllZoomsMap(
          { lat: north, lng: east },
          { lat: south, lng: west },
          MAX_ZOOM_LEVEL,
        );

        const ret = {
          ...segmentSource,
          uuid: uuid.v4(),
          sourceIdRef: source.uuid,
          targetIdRef: target.uuid,
          ...mortonNumbersByZoomLevels,
        } as unknown as GeoRouteSegmentEntity;
        console.log(ret);
        return ret;
      }),
    );

    await this.routeSegments.bulkAdd(records);
  }

  async findGISPoint({
    country,
    name_1,
    name_2,
    name,
  }: {
    country: string;
    name_1: string;
    name_2: string;
    name?: string;
  }): Promise<GeoPointEntity | undefined> {
    return this.points
      .where('[country+name_1+name_2+name]')
      .equals(country + name_1 + name_2 + name)
      .last();
  }
}

/*
export async function storeGISPoints(
  source: Array<GeoPointSource>,
): Promise<void> {
  const geoPoints: GeoPointEntity[] = source.map((s) => {
    const mortonNumber = calculateMortonNumber([s.lng, s.lat]);
    const mortonNumbersByLevels =
      calculateMortonNumbersOfZoomLevels(mortonNumber);
    return {
      ...s,
      ...mortonNumbersByLevels,
    };
  });

  await this.points.bulkAdd(geoPoints);
}

*/


/*
Webメルカトル地図で、表示画面のズームレベル、表示領域の中心点の緯度経度、表示領域の幅と高さのピクセル数に応じて、表示されるべきXYZ地図タイルのセットを計算できるようにしている。
Webメルカトル地図に重ねて表示されるポリゴンデータ群がある。あるズームレベルでポリゴンを表示する際に、ポリゴンを内側に含むようなXYZ地図タイルのセットを計算できるようにしている。ポリゴンごと、ズームレベルごとに、ポリゴンを内側に含むようなXYZ地図タイルのセットを管理する。
配列の1つめの次元は、ズームレベルである。
配列の2つめの次元は、下位の構造をグループ化して格納するためのものである。通常はグループは1つだけで、0番目の要素のみが使われる。ポリゴンが日付変更線をまたぐ場合には、0番目の要素が日付変更線の左側のグループ、1番目の要素が日付変更線の右側のグループを格納するために使われる。
配列の3つめの次元は、そのズームレベル・そのグループにおける、ポリゴンを内側に含むようなXYZ地図タイルを示す値を格納する。この値は、XYZ地図タイルのX座標の値およびY座標の値から算出したモートン番号である。

以上のような状況で、表示画面内にXYZ地図タイルとポリゴン群を描画する際に、表示されるべきXYZ地図タイルのモートン番号のセットを算出し、これを用いて、どのポリゴンが表示されるかを検索し抽出をして、描画するようにしたい。

ここで何らかの対策をしなければならないのは、高いズームレベルで大きなポリゴンを表示しようとする場合に、そのポリゴンを表示するために必要とされるXYZ地図タイルの数が、非常に多くなってしまうことである。あるポリゴンを表示するためのズームレベルごとのXYZ地図タイルのセットを計算する際に、低いズームレベルから始めて、地図タイルの数が2以上となる最初のズームレベルまでを計算し、それ以降は計算を行わない。


 */
