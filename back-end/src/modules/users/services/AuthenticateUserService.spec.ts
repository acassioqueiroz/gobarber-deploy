import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to authenticate', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUserRepository = new FakeUserRepository();
    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });
    const response = await authenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });
    expect(response).toHaveProperty('token');
    expect(response.user.email).toBe('johndoe@example.com');
  });

  it('should not be able to authenticate with non existing user', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUserRepository = new FakeUserRepository();
    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    await expect(
      authenticateUserService.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate with wrong password', async () => {
    const fakeHashProvider = new FakeHashProvider();
    const fakeUserRepository = new FakeUserRepository();
    const authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    const createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      authenticateUserService.execute({
        email: 'johndoe@example.com',
        password: 'wrong',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
