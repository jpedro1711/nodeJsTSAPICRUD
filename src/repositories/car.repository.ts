import { QueryResult } from "pg";
import { Car } from "../models/car.model";
import { BaseRepository } from "./base/BaseRepository";
import { pool } from "../config/db.config";


export class CarRepository extends BaseRepository<Car> {
  protected tableName = 'cars';

  async create(item: Car): Promise<Car> {
    const query = `
      INSERT INTO cars (model, brand, user_id, created_at, updated_at) 
      VALUES ($1, $2, $3, NOW(), NOW()) 
      RETURNING *
    `;
    const values = [item.model, item.brand, item.user_id];
    const result: QueryResult = await pool.query(query, values);
    return result.rows[0] as Car;
  }

  async update(id: number, item: Car): Promise<Car | null> {
    const query = `
      UPDATE cars 
      SET model = $1, brand = $2, user_id = $3, updated_at = NOW() 
      WHERE id = $4 
      RETURNING *
    `;
    const values = [item.model, item.brand, item.user_id ,id];
    const result: QueryResult = await pool.query(query, values);
    return result.rows.length ? result.rows[0] as Car : null;
  }
  
}