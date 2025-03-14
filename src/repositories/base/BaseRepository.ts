import { pool } from "../../config/db.config";
import { QueryResult } from 'pg';
import { Log } from "../../models/log.model";

export abstract class BaseRepository<T> {
  protected abstract tableName: string;
  
  async findAll(): Promise<T[]> {
    const query = `SELECT * FROM ${this.tableName}`;
    const result: QueryResult = await pool.query(query);
    return result.rows as T[];
  }
  
  async findById(id: number): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result: QueryResult = await pool.query(query, [id]);
    return result.rows.length ? result.rows[0] as T : null;
  }
  
  async delete(id: number): Promise<void> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    await pool.query(query, [id]);
  }
  
  protected async createLog(log: Log): Promise<void> {
    if (this.tableName !== 'logs') {
      const query = `
        INSERT INTO logs (table_name, old_data, new_data, user_id, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, NOW(), NOW())
      `;
      const values = [log.table_name, log.old_data, log.new_data, log.user_id];
      await pool.query(query, values);
    }
  }
  
  async logChanges(oldData: any, newData: any, userId: number): Promise<void> {
    await this.createLog({
      table_name: this.tableName,
      old_data: oldData || {},
      new_data: newData || {},
      user_id: userId
    });
  }
  
  abstract create(item: T): Promise<T>;
  abstract update(id: number, item: T): Promise<T | null>;
}