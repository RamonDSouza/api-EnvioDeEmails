import {EntityRepository, Repository } from "typeorm";
import { User } from "../model/User";

@EntityRepository(User)
class UsersRepository extends Repository<User>{

}

export {UsersRepository}