"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

var _dateFns = require("date-fns");

var _Appointment = _interopRequireDefault(require("../entities/Appointment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppointmentsRepository {
  constructor() {
    this.ormRepository = void 0;
    this.ormRepository = (0, _typeorm.getRepository)(_Appointment.default);
  }

  async findAllInDayFromProvider({
    provider_id,
    day,
    year,
    month
  }) {
    const start_date = new Date(year, month - 1, day, 8);
    const end_date = new Date(year, month - 1, day, 18);
    const findAppointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: (0, _typeorm.Between)(start_date, end_date)
      },
      relations: ['user']
    });
    return findAppointments;
  }

  async findAllInMonthFromProvider({
    provider_id,
    year,
    month
  }) {
    const start_date = new Date(year, month - 1, 1);
    const end_date = (0, _dateFns.endOfMonth)(start_date);
    const findAppointments = await this.ormRepository.find({
      where: {
        provider_id,
        date: (0, _typeorm.Between)(start_date, end_date)
      }
    });
    return findAppointments;
  }

  async findByDate(date, provider_id) {
    const findAppointment = await this.ormRepository.findOne({
      where: {
        date,
        provider_id
      }
    });
    return findAppointment;
  }

  async find() {
    return this.ormRepository.find();
  }

  async create(data) {
    const appointment = this.ormRepository.create(data);
    await this.ormRepository.save(appointment);
    return appointment;
  }

}

var _default = AppointmentsRepository;
exports.default = _default;