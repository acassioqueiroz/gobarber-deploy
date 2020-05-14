import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findAllProviders({
      except_user_id: user_id,
    });

    const usersWithoutPassword = users.map((user) => {
      // eslint-disable-next-line no-param-reassign
      delete user.password;
      return user;
    });

    return usersWithoutPassword;
  }
}

export default ListProvidersService;
