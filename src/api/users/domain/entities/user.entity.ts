export class User {
  constructor(
    public readonly user_id: string,
    public first_name: string,
    public last_name: string,
    public email: string,
    public avatar_id?: string | null,
    public password?: string,
    public created_at?: Date,
    public updated_at?: Date,
    public deleted_at?: Date | null,
    public avatar?: { id: string; publicId: string; url: string } | null,
    public permissions: string[] = [],
  ) {}

  // Ví dụ về một business rule trong Domain Entity
  public getFullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  public updateAvatar(avatarId: string) {
    this.avatar_id = avatarId;
  }
}
