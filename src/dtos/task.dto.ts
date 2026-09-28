export class CreateTaskDto {
  title!: string;
  description?: string | null;

  constructor(body: any) {
    this.title = body.title;
    this.description = body.description || null;
  }
}