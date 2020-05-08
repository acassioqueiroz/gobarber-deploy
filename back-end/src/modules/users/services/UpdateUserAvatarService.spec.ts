import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';

describe('CreateUser', () => {
  it('should be able to update the users avatar', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAbavarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    });

    const userUpdated = await updateUserAbavarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    expect(userUpdated.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar of a non existing user', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();
    const updateUserAbavarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );

    await expect(
      updateUserAbavarService.execute({
        user_id: '123132132',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avater when updating new one', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeStorageProvider = new FakeStorageProvider();

    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const updateUserAbavarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    });

    await updateUserAbavarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserAbavarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg',
    });

    const userFind = await fakeUserRepository.findById(user.id);
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(userFind?.avatar).toBe('avatar2.jpg');
  });
});
