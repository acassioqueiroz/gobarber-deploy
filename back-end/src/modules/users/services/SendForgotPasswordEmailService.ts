// import AppError from '@shared/errors/AppError';
import { injectable, inject } from 'tsyringe';
// import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUserTokenRepository from '@modules/users/repositories/IUsersTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
  ) {}

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('User does not exists.');
    }
    const userToken = await this.userTokenRepository.generate(user.id);

    this.mailProvider.sendMail(
      email,
      `Pedido de recuperação de senha recebido. Token: ${userToken.token}`,
    );
  }
}

export default SendForgotPasswordEmailService;
