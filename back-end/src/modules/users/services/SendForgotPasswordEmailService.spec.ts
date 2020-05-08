import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUsersTokenRepository = new FakeUsersTokenRepository();
    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUsersTokenRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com',
    });
    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recovery a nonexisting user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'johndoe@exampler.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const gnerateToken = jest.spyOn(fakeUsersTokenRepository, 'generate');

    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com',
    });
    expect(gnerateToken).toHaveBeenCalled();
  });
});
