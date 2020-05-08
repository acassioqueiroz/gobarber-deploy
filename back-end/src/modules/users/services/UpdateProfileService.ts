import 'reflect-metadata';
import { injectable, inject } from 'tsyringe';
import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  password?: string;
  old_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found.');
    }
    const findUserToCheckEmailExists = await this.usersRepository.findByEmail(
      email,
    );
    if (
      findUserToCheckEmailExists &&
      findUserToCheckEmailExists.id !== user_id
    ) {
      throw new AppError('E-mail already in use.');
    }

    if (password) {
      if (!old_password) {
        throw new AppError('Old password must be informed');
      }
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Invalid old password');
      }
      user.password = await this.hashProvider.generateHash(password);
    }

    Object.assign(user, { name, email });
    return this.usersRepository.save(user);
  }
}

export default UpdateProfileService;
