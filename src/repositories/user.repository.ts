import { BaseRepository } from './base/BaseRepository';
import { User } from '../models/user.model';
import { pool } from '../config/db.config';
import { QueryResult } from 'pg';

export class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';
  
  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (name, email, created_at, updated_at) 
      VALUES ($1, $2, NOW(), NOW()) 
      RETURNING *
    `;
    const values = [user.name, user.email];
    const result: QueryResult = await pool.query(query, values);

    var createdUser: User = result.rows[0] as User;

    await this.logChanges({}, createdUser, createdUser.id as number);

    return createdUser;
  }
  
  async update(id: number, user: User): Promise<User | null> {

    const oldUser: User | null = await this.findById(id);

    const query = `
      UPDATE users 
      SET name = $1, email = $2, updated_at = NOW() 
      WHERE id = $3 
      RETURNING *
    `;
    const values = [user.name, user.email, id];
    const result: QueryResult = await pool.query(query, values);

    var updatedUser: User | null = result.rows.length ? result.rows[0] as User : null;

    if (updatedUser) {
      await this.logChanges(oldUser, updatedUser, updatedUser.id as number);
    }

    return updatedUser;
  }
  
  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result: QueryResult = await pool.query(query, [email]);
    return result.rows.length ? result.rows[0] as User : null;
  }

  async findUserWithCars(id: number) : Promise<User | null> {
    const query = `
      SELECT * FROM users u
      INNER JOIN cars ON cars.user_id = u.id
      WHERE u.id = $1
    `;

    const result: QueryResult = await pool.query(query, [id]);
    return result.rows.length ? result.rows[0] as User : null;
  }
}
