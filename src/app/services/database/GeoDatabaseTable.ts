import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import { GeoDatabase } from './GeoDatabase';
import { ResourceType } from 'src/app/models/ResourceType';
import { ProjectEntity } from 'src/app/models/ProjectEntity';
import { ResourceEntity, ResourceItems } from 'src/app/models/ResourceEntity';
import {
  GeoDatabaseTableType,
  GeoDatabaseTableTypes,
} from './GeoDatabaseTableType';
import { TABLE_DB_NAME } from 'src/app/Constants';

export class GeoDatabaseTable extends Dexie {
  private static singleton: GeoDatabaseTable;
  public resources: Dexie.Table<ResourceEntity, number>;
  public projects: Dexie.Table<ProjectEntity, number>;

  public constructor() {
    super(TABLE_DB_NAME);
    this.version(3).stores({
      resources: '++id, &uuid, type, name',
      projects: '++id, &uuid, type, name',
    });
    this.resources = this.table('resources');
    this.projects = this.table('projects');
  }

  static getSingleton() {
    if (!GeoDatabaseTable.singleton) {
      GeoDatabaseTable.singleton = new GeoDatabaseTable();
    }
    return GeoDatabaseTable.singleton;
  }

  static async getResources() {
    return GeoDatabaseTable.getSingleton().resources.toArray();
  }

  static async getProjects() {
    return GeoDatabaseTable.getSingleton().projects.toArray();
  }

  static async getResource(uuid: string) {
    return GeoDatabaseTable.getSingleton()
      .resources.where('uuid')
      .equals(uuid)
      .toArray();
  }

  static async getProject(uuid: string) {
    return GeoDatabaseTable.getSingleton()
      .projects.where('uuid')
      .equals(uuid)
      .toArray();
  }

  static getTableByTableType(type: GeoDatabaseTableType) {
    switch (type) {
      case GeoDatabaseTableTypes.projects:
        return GeoDatabaseTable.getSingleton().projects;
      case GeoDatabaseTableTypes.resources:
        return GeoDatabaseTable.getSingleton().resources;
      default:
        throw new Error(`Unknown Type: ${type}`);
    }
  }

  static async createResource(source: {
    type: ResourceType;
    name: string;
    description: string;
    items: ResourceItems[];
    version: number;
    createdAt: number;
  }) {
    const uuid = uuidv4();
    GeoDatabaseTable.getSingleton().resources.add({
      ...source,
      uuid,
      updatedAt: source.createdAt,
    });
    const db = await GeoDatabase.openWithUUID(
      GeoDatabaseTableTypes.resources,
      uuid,
    );
    db.close();
  }

  static async createProject(source: {
    type: string;
    name: string;
    description: string;
    viewportCenter: [number, number, number];
    version: number;
    createdAt: number;
  }) {
    const uuid = uuidv4();
    GeoDatabaseTable.getSingleton().projects.add({
      ...source,
      uuid,
      updatedAt: source.createdAt,
    });
    const db = await GeoDatabase.openWithUUID(
      GeoDatabaseTableTypes.projects,
      uuid,
    );
    db.close();
  }

  static async updateResource(
    uuid: string,
    newEntity: {
      name: string;
      description: string | undefined;
      coordinate?: [number, number];
      zoom?: number;
    },
  ) {
    const entity = await GeoDatabaseTable.getSingleton()
      .resources.where('uuid')
      .equals(uuid)
      .last();
    entity &&
      (await GeoDatabaseTable.getSingleton().resources.update(entity, {
        ...newEntity,
        updatedAt: Date.now(),
      }));
  }

  static async updateProject(
    uuid: string,
    newEntity: {
      name: string;
      description: string | undefined;
      coordinate?: [number, number];
      zoom?: number;
    },
  ) {
    const entity = await GeoDatabaseTable.getSingleton()
      .projects.where('uuid')
      .equals(uuid)
      .last();
    entity &&
      (await GeoDatabaseTable.getSingleton().projects.update(entity, {
        ...newEntity,
        updatedAt: Date.now(),
      }));
  }
}

export function getCurrentDatabaseTableType() {
  if (document.location.hash.startsWith('#/projects')) {
    return GeoDatabaseTableTypes.projects;
  }
  if (document.location.hash.startsWith('#/resources')) {
    return GeoDatabaseTableTypes.resources;
  }
  throw new Error('Unrecognizable Type: ' + document.location.hash);
}
