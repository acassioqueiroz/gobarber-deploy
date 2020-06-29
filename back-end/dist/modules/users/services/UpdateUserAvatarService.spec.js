"use strict";

var _FakeStorageProvider = _interopRequireDefault(require("../../../shared/container/providers/StorageProvider/fakes/FakeStorageProvider"));

var _UpdateUserAvatarService = _interopRequireDefault(require("./UpdateUserAvatarService"));

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeStorageProvider;
let updateUserAbavarService;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeStorageProvider = new _FakeStorageProvider.default();
    updateUserAbavarService = new _UpdateUserAvatarService.default(fakeUserRepository, fakeStorageProvider);
  });
  it('should be able to update the users avatar', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567'
    });
    const userUpdated = await updateUserAbavarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });
    expect(userUpdated.avatar).toBe('avatar.jpg');
  });
  it('should not be able to update avatar of a non existing user', async () => {
    await expect(updateUserAbavarService.execute({
      user_id: '123132132',
      avatarFilename: 'avatar.jpg'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to delete old avater when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567'
    });
    await updateUserAbavarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar.jpg'
    });
    await updateUserAbavarService.execute({
      user_id: user.id,
      avatarFilename: 'avatar2.jpg'
    });
    const userFind = await fakeUserRepository.findById(user.id);
    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(userFind === null || userFind === void 0 ? void 0 : userFind.avatar).toBe('avatar2.jpg');
  });
});