import { Car } from "../car.model";
import { User } from "../user.model";

export interface UserWithCars {
  user: User
  cars: Array<Car>
}