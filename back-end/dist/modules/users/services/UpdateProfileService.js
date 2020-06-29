"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("reflect-metadata");

var _tsyringe = require("tsyringe");

var _IUserRepository = _interopRequireDefault(require("../repositories/IUserRepository"));

var _IHashProvider = _interopRequireDefault(require("../providers/HashProvider/models/IHashProvider"));

var _AppError = _interopRequireDefault(require("../../../shared/errors/AppError"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let UpdateProfileService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UserRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('HashProvider')(target, undefined, 1);
}, _dec4 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 2);
}, _dec5 = Reflect.metadata("design:type", Function), _dec6 = Reflect.metadata("design:paramtypes", [typeof _IUserRepository.default === "undefined" ? Object : _IUserRepository.default, typeof _IHashProvider.default === "undefined" ? Object : _IHashProvider.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = class UpdateProfileService {
  constructor(usersRepository, hashProvider, cacheProvider) {
    this.usersRepository = usersRepository;
    this.hashProvider = hashProvider;
    this.cacheProvider = cacheProvider;
  }

  async execute({
    user_id,
    name,
    email,
    password,
    old_password
  }) {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new _AppError.default('User not found.');
    }

    const findUserToCheckEmailExists = await this.usersRepository.findByEmail(email);

    if (findUserToCheckEmailExists && findUserToCheckEmailExists.id !== user_id) {
      throw new _AppError.default('E-mail already in use.');
    }

    if (password) {
      if (!old_password) {
        throw new _AppError.default('Old password must be informed');
      }

      const checkOldPassword = await this.hashProvider.compareHash(old_password, user.password);

      if (!checkOldPassword) {
        throw new _AppError.default('Invalid old password');
      }

      user.password = await this.hashProvider.generateHash(password);
    }

    await this.cacheProvider.invalidatePrefix('providers-list');
    await this.cacheProvider.invalidatePrefix('provider-appointments');
    Object.assign(user, {
      name,
      email
    });
    return this.usersRepository.save(user);
  }

}) || _class) || _class) || _class) || _class) || _class) || _class);
var _default = UpdateProfileService;
exports.default = _default;