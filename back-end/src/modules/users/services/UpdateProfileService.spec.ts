import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    });

    const userUpdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe2',
      email: 'johndoe2@example.com',
    });

    expect(userUpdated.name).toBe('John Doe2');
    expect(userUpdated.email).toBe('johndoe2@example.com');
  });

  it('should not be able to update the profile of a non existing user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: '', // non existing user
        name: 'John Doe2',
        email: 'johndoe2@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the email to another using e-mail', async () => {
    await fakeUserRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      password: '123456',
    });

    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Test',
        email: 'teste@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    const userUpdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe2',
      email: 'johndoe2@example.com',
      password: '123123',
      old_password: '123456',
    });

    expect(userUpdated.password).toBe('123123');
  });

  it('should not be able to update the password without inform the old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe2',
        email: 'johndoe2@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'John Doe2',
        email: 'johndoe2@example.com',
        password: '123123',
        old_password: 'wrong-old-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
