"use strict";

var _tsyringe = require("tsyringe");

require("../../modules/users/providers");

require("./providers");

var _AppointmentsRepository = _interopRequireDefault(require("../../modules/appointments/infra/typeorm/repositories/AppointmentsRepository"));

var _UserRepository = _interopRequireDefault(require("../../modules/users/infra/typeorm/repositories/UserRepository"));

var _UsersTokenRepository = _interopRequireDefault(require("../../modules/users/infra/typeorm/repositories/UsersTokenRepository"));

var _NotificationsRepository = _interopRequireDefault(require("../../modules/notifications/infra/typeorm/repositories/NotificationsRepository"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_tsyringe.container.registerSingleton('AppointmentsRepository', _AppointmentsRepository.default);

_tsyringe.container.registerSingleton('UsersTokenRepository', _UsersTokenRepository.default);

_tsyringe.container.registerSingleton('NotificationsRepository', _NotificationsRepository.default);

_tsyringe.container.registerSingleton('UserRepository', _UserRepository.default);