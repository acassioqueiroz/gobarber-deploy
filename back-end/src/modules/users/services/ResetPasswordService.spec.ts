import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';
import AppError from '@shared/errors/AppError';
import { uuid } from 'uuidv4';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeUsersTokenRepository: FakeUsersTokenRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUsersTokenRepository = new FakeUsersTokenRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUserRepository,
      fakeHashProvider,
      fakeUsersTokenRepository,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const { token } = await fakeUsersTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({ token, password: '123123' });
    const updatedUser = await fakeUserRepository.findById(user.id);
    expect(updatedUser).toBeTruthy();
    if (updatedUser) {
      expect(
        await fakeHashProvider.compareHash('123123', updatedUser.password),
      ).toBeTruthy();
    }
    expect(generateHash).toHaveBeenCalledWith('123123');
  });

  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing-token',
        password: 'abcd1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password of a non existing user', async () => {
    const { token } = await fakeUsersTokenRepository.generate(
      'non-existing-user',
    );
    await expect(
      resetPasswordService.execute({ token, password: '123123' }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const { token } = await fakeUsersTokenRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });
    await expect(
      resetPasswordService.execute({
        password: 'abcd1234',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
