import Dexie from 'dexie';
import { v4 as uuidv4 } from 'uuid';
import { ProjectEntity } from './ProjectEntity';
import { ProjectType } from '../../pages/ProjectIndex/ProjectType';

const TABLE_NAME = 'ProjectTable';

export class ProjectTableDB extends Dexie {
  private static singleton: ProjectTableDB;
  public projects: Dexie.Table<ProjectEntity, number>;

  public constructor() {
    super(TABLE_NAME);
    this.version(3).stores({
      projects: '++id, &uuid, name',
    });
    this.projects = this.table('projects');
  }

  static getSingleton() {
    if (!ProjectTableDB.singleton) {
      ProjectTableDB.singleton = new ProjectTableDB();
    }
    return ProjectTableDB.singleton;
  }

  static async getProjects() {
    return ProjectTableDB.getSingleton().projects.toArray();
  }

  static async createProject(source: {
    type: ProjectType;
    name: string;
    description: string;
    version: number;
    coordinate: [number, number];
    zoom: number;
    createdAt: number;
  }) {
    console.log(source);
    await ProjectTableDB.getSingleton().projects.add({
      ...source,
      uuid: uuidv4(),
      updatedAt: source.createdAt,
    });
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
    const entity = await ProjectTableDB.getSingleton()
      .projects.where('uuid')
      .equals(uuid)
      .last();
    entity &&
      (await ProjectTableDB.getSingleton().projects.update(entity, {
        ...newEntity,
        updatedAt: Date.now(),
      }));
  }
}
