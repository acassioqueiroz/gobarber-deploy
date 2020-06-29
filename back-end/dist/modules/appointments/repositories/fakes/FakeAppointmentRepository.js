"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dateFns = require("date-fns");

var _uuidv = require("uuidv4");

var _Appointment = _interopRequireDefault(require("../../infra/typeorm/entities/Appointment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AppointmentsRepository {
  constructor() {
    this.appointments = [];
  }

  async findAllInDayFromProvider({
    provider_id,
    day,
    year,
    month
  }) {
    const findAppointments = this.appointments.filter(appointment => {
      return appointment.provider_id === provider_id && (0, _dateFns.getDate)(appointment.date) === day && (0, _dateFns.getYear)(appointment.date) === year && (0, _dateFns.getMonth)(appointment.date) + 1 === month;
    });
    return findAppointments;
  }

  async findAllInMonthFromProvider({
    provider_id,
    year,
    month
  }) {
    const findAppointments = this.appointments.filter(appointment => {
      return appointment.provider_id === provider_id && (0, _dateFns.getYear)(appointment.date) === year && (0, _dateFns.getMonth)(appointment.date) + 1 === month;
    });
    return findAppointments;
  }

  async findByDate(date, provider_id) {
    const findAppointment = this.appointments.find(appointment => appointment.provider_id === provider_id && (0, _dateFns.isEqual)(appointment.date, date));
    return findAppointment;
  }

  async find() {
    return this.appointments;
  }

  async create({
    date,
    provider_id,
    user_id
  }) {
    const appointment = new _Appointment.default();
    Object.assign(appointment, {
      id: (0, _uuidv.uuid)(),
      date,
      provider_id,
      user_id
    });
    this.appointments.push(appointment);
    return appointment;
  }

}

var _default = AppointmentsRepository;
exports.default = _default;