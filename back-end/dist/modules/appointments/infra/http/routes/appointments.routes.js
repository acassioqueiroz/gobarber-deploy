"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _celebrate = require("celebrate");

var _ensureAuthenticated = _interopRequireDefault(require("../../../../users/infra/http/middlewares/ensureAuthenticated"));

var _AppoinetmentsController = _interopRequireDefault(require("../controllers/AppoinetmentsController"));

var _ProviderAppoinetmentsController = _interopRequireDefault(require("../controllers/ProviderAppoinetmentsController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const appointmentsRouter = (0, _express.Router)();
appointmentsRouter.use(_ensureAuthenticated.default);
const appointmentsController = new _AppoinetmentsController.default();
const providerAppointmentsController = new _ProviderAppoinetmentsController.default();
appointmentsRouter.post('/', (0, _celebrate.celebrate)({
  [_celebrate.Segments.BODY]: {
    provider_id: _celebrate.Joi.string().uuid().required(),
    date: _celebrate.Joi.date()
  }
}), appointmentsController.create);
appointmentsRouter.get('/me', providerAppointmentsController.index);
var _default = appointmentsRouter;
exports.default = _default;