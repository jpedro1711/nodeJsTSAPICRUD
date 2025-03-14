import { QueryResult } from "pg";
import { Log } from "../models/log.model";
import { BaseRepository } from "./base/BaseRepository";
import { pool } from "../config/db.config";

export class LogRepository extends BaseRepository<Log> {
  protected tableName = 'logs';

  async create(item: Log): Promise<Log> {
    const query = `
      INSERT INTO logs (table_name, old_data, new_data, user_id, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      RETURNING *
    `;
    const values = [item.table_name, item.old_data, item.new_data, item.user_id];
    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] as Log;
  }

  async update(id: number, item: Log): Promise<Log | null> {
    const query = `
      UPDATE logs 
      SET old_data = $1, new_data = $2, user_id = $3, updated_at = NOW() 
      WHERE id = $4 
      RETURNING *
    `;
    const values = [item.old_data, item.new_data, item.user_id, id];
    const result: QueryResult = await pool.query(query, values);
    return result.rows.length ? result.rows[0] as Log : null;
  }
}