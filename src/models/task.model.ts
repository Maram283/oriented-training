export class TaskModel {
  constructor(
    public id: number,
    public title: string,
    public description: string | null,
    public status: string,
    public userId: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {}

  static fromPrisma(prismaTask: any): TaskModel | null {
    if (!prismaTask) {
      return null;
    }
    return new TaskModel(
      prismaTask.id,
      prismaTask.title,
      prismaTask.description,
      prismaTask.status,
      prismaTask.userId,
      prismaTask.createdAt,
      prismaTask.updated_at
    );
  }
}