// better use constructor and class
export class Car{
  id?: number;
  model: string;
  brand: string;
  created_at?: Date;
  updated_at?: Date;
  user_id: number;

  constructor(id: number, model: string, brand: string, user_id: number, created_at?: Date, updated_at?: Date) {
    this.id = id;
    this.model = model;
    this.brand = brand;
    this.created_at = created_at;
    this.updated_at = updated_at;
    this.user_id = user_id;
  }
}