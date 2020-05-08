import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';

let fakeUserRepository: FakeUserRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAbavarService: UpdateUserAvatarService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAbavarService = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update the users avatar', async () => {
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
    await expect(
      updateUserAbavarService.execute({
        user_id: '123132132',
        avatarFilename: 'avatar.jpg',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete old avater when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

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
