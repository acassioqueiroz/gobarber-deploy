import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
// import AppError from '@shared/errors/AppError';
import ListProvidersService from './ListProvidersService';

let fakeUserRepository: FakeUserRepository;
let listProviders: ListProvidersService;

describe('ListProvidersService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    listProviders = new ListProvidersService(fakeUserRepository);
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

    expect(providers).toEqual([user1, user2]);
  });
});
