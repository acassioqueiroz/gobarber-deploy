"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _User = _interopRequireDefault(require("../entities/User"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class UsersRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_User.default);
  }

  async findAllProviders({
    except_user_id
  }) {
    const findUsers = await this.ormRepository.find({
      where: {
        id: (0, _typeorm.Not)(except_user_id)
      }
    });
    return findUsers;
  }

  async findById(id) {
    const findUsers = await this.ormRepository.findOne({
      where: {
        id
      }
    });
    return findUsers;
  }

  async findByEmail(email) {
    const findUsers = await this.ormRepository.findOne({
      where: {
        email
      }
    });
    return findUsers;
  }

  async save(data) {
    return this.ormRepository.save(data);
  }

  async create(data) {
    const appointment = this.ormRepository.create(data);
    await this.ormRepository.save(appointment);
    return appointment;
  }

}

var _default = UsersRepository;
exports.default = _default;