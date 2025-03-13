import { pool } from "../../config/db.config";
import { QueryResult } from 'pg';

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
  
  abstract create(item: T): Promise<T>;
  abstract update(id: number, item: T): Promise<T | null>;
}