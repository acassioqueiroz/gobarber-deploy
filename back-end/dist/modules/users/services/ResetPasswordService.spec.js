"use strict";

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _ResetPasswordService = _interopRequireDefault(require("./ResetPasswordService"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeUsersTokenRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersTokenRepository"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeUsersTokenRepository;
let fakeHashProvider;
let resetPasswordService;
describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeUsersTokenRepository = new _FakeUsersTokenRepository.default();
    fakeHashProvider = new _FakeHashProvider.default();
    resetPasswordService = new _ResetPasswordService.default(fakeUserRepository, fakeHashProvider, fakeUsersTokenRepository);
  });
  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUsersTokenRepository.generate(user.id);
    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');
    await resetPasswordService.execute({
      token,
      password: '123123'
    });
    const updatedUser = await fakeUserRepository.findById(user.id);
    expect(updatedUser).toBeTruthy();

    if (updatedUser) {
      expect(await fakeHashProvider.compareHash('123123', updatedUser.password)).toBeTruthy();
    }

    expect(generateHash).toHaveBeenCalledWith('123123');
  });
  it('should not be able to reset the password with non-existing token', async () => {
    await expect(resetPasswordService.execute({
      token: 'non-existing-token',
      password: 'abcd1234'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset the password of a non existing user', async () => {
    const {
      token
    } = await fakeUsersTokenRepository.generate('non-existing-user');
    await expect(resetPasswordService.execute({
      token,
      password: '123123'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const {
      token
    } = await fakeUsersTokenRepository.generate(user.id);
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });
    await expect(resetPasswordService.execute({
      password: 'abcd1234',
      token
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});