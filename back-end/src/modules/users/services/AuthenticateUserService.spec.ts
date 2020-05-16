import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import AppError from '@shared/errors/AppError';

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUserRepository;
let authenticateUserService: AuthenticateUserService;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    authenticateUserService = new AuthenticateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });
  it('should be able to authenticate', async () => {
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
    await expect(
      authenticateUserService.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to authenticate with wrong password', async () => {
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
