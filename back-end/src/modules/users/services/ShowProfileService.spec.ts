import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUserRepository;
let showProfile: ShowProfileService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    showProfile = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });

  it('should be able to show the password on profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567',
    });

    const profile = await showProfile.execute({ user_id: user.id });

    expect(profile.password).toBeFalsy();
  });

  it('should not be able to show the profile with non existing user_id', async () => {
    await expect(showProfile.execute({ user_id: '' })).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
