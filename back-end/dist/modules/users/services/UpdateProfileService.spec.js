"use strict";

var _UpdateProfileService = _interopRequireDefault(require("./UpdateProfileService"));

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeHashProvider;
let updateProfileService;
let fakeCacheProvider;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    updateProfileService = new _UpdateProfileService.default(fakeUserRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567'
    });
    const userUpdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe2',
      email: 'johndoe2@example.com'
    });
    expect(userUpdated.name).toBe('John Doe2');
    expect(userUpdated.email).toBe('johndoe2@example.com');
  });
  it('should not be able to update the profile of a non existing user', async () => {
    await expect(updateProfileService.execute({
      user_id: '',
      // non existing user
      name: 'John Doe2',
      email: 'johndoe2@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to change the email to another using e-mail', async () => {
    await fakeUserRepository.create({
      name: 'Teste',
      email: 'teste@example.com',
      password: '123456'
    });
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Test',
      email: 'teste@example.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const userUpdated = await updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe2',
      email: 'johndoe2@example.com',
      password: '123123',
      old_password: '123456'
    });
    expect(userUpdated.password).toBe('123123');
  });
  it('should not be able to update the password without inform the old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe2',
      email: 'johndoe2@example.com',
      password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be not able to update the password with wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await expect(updateProfileService.execute({
      user_id: user.id,
      name: 'John Doe2',
      email: 'johndoe2@example.com',
      password: '123123',
      old_password: 'wrong-old-password'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});