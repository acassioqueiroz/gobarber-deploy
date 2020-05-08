import { injectable, inject } from 'tsyringe';
import { differenceInMinutes } from 'date-fns';
// import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
  ) {}

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokenRepository.findByToken(token);
    if (!userToken) {
      throw new AppError('User token does not exists.');
    }
    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError('User does not exists.');
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInMinutes(Date.now(), tokenCreatedAt) > 120) {
      throw new AppError('Token expried');
    }

    user.password = await this.hashProvider.generateHash(password);
    this.usersRepository.save(user);
  }
}

export default SendForgotPasswordEmailService;
