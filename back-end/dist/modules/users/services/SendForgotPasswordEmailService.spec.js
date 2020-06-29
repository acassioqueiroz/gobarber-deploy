"use strict";

var _FakeUserRepository = _interopRequireDefault(require("../repositories/fakes/FakeUserRepository"));

var _SendForgotPasswordEmailService = _interopRequireDefault(require("./SendForgotPasswordEmailService"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _FakeMailProvider = _interopRequireDefault(require("../../../shared/container/providers/MailProvider/fakes/FakeMailProvider"));

var _FakeUsersTokenRepository = _interopRequireDefault(require("../repositories/fakes/FakeUsersTokenRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeUserRepository;
let fakeMailProvider;
let fakeUsersTokenRepository;
let sendForgotPasswordEmailService;
describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUserRepository = new _FakeUserRepository.default();
    fakeMailProvider = new _FakeMailProvider.default();
    fakeUsersTokenRepository = new _FakeUsersTokenRepository.default();
    sendForgotPasswordEmailService = new _SendForgotPasswordEmailService.default(fakeUserRepository, fakeMailProvider, fakeUsersTokenRepository);
  });
  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com'
    });
    expect(sendMail).toHaveBeenCalled();
  });
  it('should not be able to recovery a nonexisting user password', async () => {
    await expect(sendForgotPasswordEmailService.execute({
      email: 'johndoe@exampler.com'
    })).rejects.toBeInstanceOf(_AppError.default);
  });
  it('should generate a forgot password token', async () => {
    const gnerateToken = jest.spyOn(fakeUsersTokenRepository, 'generate');
    await fakeUserRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    });
    await sendForgotPasswordEmailService.execute({
      email: 'johndoe@example.com'
    });
    expect(gnerateToken).toHaveBeenCalled();
  });
});