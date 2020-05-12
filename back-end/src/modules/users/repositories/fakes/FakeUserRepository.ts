import { uuid } from 'uuidv4';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProviersDTO';

class FaceUsersRepository implements IUserRepository {
  private users: User[] = [];

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    return this.users.filter((filterUser) => filterUser.id !== except_user_id);
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find((user) => user.id === id);
    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(
      (currentUser) => currentUser.email === email,
    );
    return findUser;
  }

  public async save(data: User): Promise<User> {
    const findIndex = this.users.findIndex((user) => user.id === data.id);
    this.users[findIndex] = data;
    return this.users[findIndex];
  }

  public async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, { id: uuid() }, data);
    this.users.push(user);
    return user;
  }
}

export default FaceUsersRepository;
