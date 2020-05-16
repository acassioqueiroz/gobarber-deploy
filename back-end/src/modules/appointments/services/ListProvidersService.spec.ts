import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviders = new ListProvidersService(
      fakeUserRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to show the profile', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    });

    const user2 = await fakeUserRepository.create({
      name: 'John Tre',
      email: 'johntre@example.com',
      password: '1234567',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'John Logged',
      email: 'johnlogged@example.com',
      password: '1234567',
    });

    const providers = await listProviders.execute({ user_id: loggedUser.id });

    delete user1.password;
    delete user2.password;

    expect(providers[0]).toEqual(expect.objectContaining(user1));
    expect(providers[1]).toEqual(expect.objectContaining(user2));
  });
});
