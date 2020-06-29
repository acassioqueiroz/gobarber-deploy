"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tsyringe = require("tsyringe");

var _ListProviderDayAvailabilityService = _interopRequireDefault(require("../../../services/ListProviderDayAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ProvidersController {
  async index(request, response) {
    const {
      day,
      month,
      year
    } = request.query;
    const {
      provider_id
    } = request.params;

    const listProviderDayAvailability = _tsyringe.container.resolve(_ListProviderDayAvailabilityService.default);

    const providers = await listProviderDayAvailability.execute({
      provider_id,
      month: Number(month),
      day: Number(day),
      year: Number(year)
    });
    return response.json(providers);
  }

}

exports.default = ProvidersController;