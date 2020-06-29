"use strict";

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _CreateUserService = _interopRequireDefault(require("./CreateUserService"));

var _AuthenticateUserService = _interopRequireDefault(require("./AuthenticateUserService"));

var _FakeHashProvider = _interopRequireDefault(require("../providers/HashProvider/fakes/FakeHashProvider"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeHashProvider;
let fakeUserRepository;
let authenticateUserService;
let createUserService;
let fakeCacheProvider;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeHashProvider = new _FakeHashProvider.default();
    fakeUserRepository = new _FakeUserRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    authenticateUserService = new _AuthenticateUserService.default(fakeUserRepository, fakeHashProvider);
    createUserService = new _CreateUserService.default(fakeUserRepository, fakeHashProvider, fakeCacheProvider);
  });
  it('should be able to authenticate', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    const response = await authenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456'
    });
    expect(response).toHaveProperty('token');
    expect(response.user.email).toBe('johndoe@example.com');
  });
  it('should not be able to authenticate with non existing user', async () => {
    await expect(authenticateUserService.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should be able to authenticate with wrong password', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await expect(authenticateUserService.execute({
      email: 'johndoe@example.com',
      password: 'wrong'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});