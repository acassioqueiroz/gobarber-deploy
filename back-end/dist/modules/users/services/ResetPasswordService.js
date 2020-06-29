"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _dateFns = require("date-fns");

var _IUserRepository = _interopRequireDefault(require("../repositories/IUserRepository"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _IUsersTokenRepository = _interopRequireDefault(require("../repositories/IUsersTokenRepository"));

var _IHashProvider = _interopRequireDefault(require("../providers/HashProvider/models/IHashProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ResetPasswordService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UserRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('HashProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('UsersTokenRepository')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IUserRepository.default === "undefined" ? Object : _IUserRepository.default, typeof _IHashProvider.default === "undefined" ? Object : _IHashProvider.default, typeof _IUsersTokenRepository.default === "undefined" ? Object : _IUsersTokenRepository.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class ResetPasswordService {
  constructor(usersRepository, hashProvider, usersTokenRepository) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
    this.usersTokenRepository = usersTokenRepository;
  }

  async execute({
    token,
    password
  }) {
    const userToken = await this.usersTokenRepository.findByToken(token);

    if (!userToken) {
      throw new _AppError.default('User token does not exists.');
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new _AppError.default('User does not exists.');
    }

    const tokenCreatedAt = userToken.created_at;

    if ((0, _dateFns.differenceInMinutes)(Date.now(), tokenCreatedAt) > 120) {
      throw new _AppError.default('Token expried');
    }

    user.password = await this.hashProvider.generateHash(password);
    await this.usersRepository.save(user);
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = ResetPasswordService;
exports.default = _default;