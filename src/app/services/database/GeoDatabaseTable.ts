import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import { GeoDatabaseEntity } from './GeoDatabaseEntity';
import { ProjectType } from './ProjectType';
import { GeoDatabase } from './GeoDatabase';
import { ResourceType } from '../../models/ResourceEntity';

const TABLE_NAME = 'databases';

export class GeoDatabaseTable extends Dexie {
  private static singleton: GeoDatabaseTable;
  public databases: Dexie.Table<GeoDatabaseEntity, number>;

  public constructor() {
    super(TABLE_NAME);
    this.version(3).stores({
      [TABLE_NAME]: '++id, &uuid, type, name',
    });
    this.databases = this.table(TABLE_NAME);
  }

  static getSingleton() {
    if (!GeoDatabaseTable.singleton) {
      GeoDatabaseTable.singleton = new GeoDatabaseTable();
    }
    return GeoDatabaseTable.singleton;
  }

  static async getDatabases() {
    return GeoDatabaseTable.getSingleton().databases.toArray();
  }

  static async createDatabase(source: {
    type: ProjectType | ResourceType;
    name: string;
    description: string;
    urls: [];
    version: number;
    viewportCenter: [number, number, number];
    createdAt: number;
  }) {
    const uuid = uuidv4();
    await GeoDatabaseTable.getSingleton().databases.add({
      ...source,
      uuid,
      updatedAt: source.createdAt,
    });
    const db = await GeoDatabase.open(uuid);
    db.close();
  }

  static async updateDatabase(
    uuid: string,
    newEntity: {
      name: string;
      description: string | undefined;
      coordinate?: [number, number];
      zoom?: number;
    },
  ) {
    const entity = await GeoDatabaseTable.getSingleton()
      .databases.where('uuid')
      .equals(uuid)
      .last();
    entity &&
      (await GeoDatabaseTable.getSingleton().databases.update(entity, {
        ...newEntity,
        updatedAt: Date.now(),
      }));
  }
}
