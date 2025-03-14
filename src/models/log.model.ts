export interface Log {
  id?: number;
  table_name: string;
  old_data: object;
  new_data: object;
  created_at?: Date;
  updated_at?: Date;
  user_id: number
}