"use strict";

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ShowProfileService = _interopRequireDefault(require("./ShowProfileService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let showProfile;
describe('CreateUser', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    showProfile = new _ShowProfileService.default(fakeUserRepository);
  });
  it('should be able to show the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567'
    });
    const profile = await showProfile.execute({
      user_id: user.id
    });
    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@example.com');
  });
  it('should be able to show the password on profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '1234567'
    });
    const profile = await showProfile.execute({
      user_id: user.id
    });
    expect(profile.password).toBeFalsy();
  });
  it('should not be able to show the profile with non existing user_id', async () => {
    await expect(showProfile.execute({
      user_id: ''
    })).rejects.toBeInstanceOf(_AppError.default);
  });
});