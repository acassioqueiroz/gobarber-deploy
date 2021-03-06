"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("reflect-metadata");

var _tsyringe = require("tsyringe");

var _classTransformer = require("class-transformer");

var _IUserRepository = _interopRequireDefault(require("../../users/repositories/IUserRepository"));

var _ICacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/models/ICacheProvider"));

var _dec, _dec2, _dec3, _dec4, _dec5, _class;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let ListProvidersService = (_dec = (0, _tsyringe.injectable)(), _dec2 = function (target, key) {
  return (0, _tsyringe.inject)('UserRepository')(target, undefined, 0);
}, _dec3 = function (target, key) {
  return (0, _tsyringe.inject)('CacheProvider')(target, undefined, 1);
}, _dec4 = Reflect.metadata("design:type", Function), _dec5 = Reflect.metadata("design:paramtypes", [typeof _IUserRepository.default === "undefined" ? Object : _IUserRepository.default, typeof _ICacheProvider.default === "undefined" ? Object : _ICacheProvider.default]), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = class ListProvidersService {
  constructor(usersRepository, cacheProvider) {
    this.usersRepository = usersRepository;
    this.cacheProvider = cacheProvider;
  }

  async execute({
    user_id
  }) {
    const cacheKey = `providers-list:${user_id}`;
    let users = await this.cacheProvider.recover(cacheKey);

    if (!users) {
      const findUsers = await this.usersRepository.findAllProviders({
        except_user_id: user_id
      });
      users = (0, _classTransformer.classToClass)(findUsers);
      await this.cacheProvider.save(cacheKey, users);
    }

    return users;
  }

}) || _class) || _class) || _class) || _class) || _class);
var _default = ListProvidersService;
exports.default = _default;