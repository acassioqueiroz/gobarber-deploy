"use strict";

var _FakeUserRepository = _interopRequireDefault(require("../../users/repositories/fakes/FakeUserRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _ListProvidersService = _interopRequireDefault(require("./ListProvidersService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let listProviders;
let fakeCacheProvider;
describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviders = new _ListProvidersService.default(fakeUserRepository, fakeCacheProvider);
  });
  it('should be able to show the profile', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567'
    });
    const user2 = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '1234567'
    });
    const loggedUser = await fakeUserRepository.create({
      name: 'John Logged',
      email: 'johnlogged@example.com',
      password: '1234567'
    });
    const providers = await listProviders.execute({
      user_id: loggedUser.id
    });
    delete user1.password;
    delete user2.password;
    expect(providers[0]).toEqual(expect.objectContaining(user1));
    expect(providers[1]).toEqual(expect.objectContaining(user2));
  });
});