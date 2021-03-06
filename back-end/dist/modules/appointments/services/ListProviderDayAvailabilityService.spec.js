"use strict";

var _FakeAppointmentRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentRepository"));

var _ListProviderDayAvailabilityService = _interopRequireDefault(require("./ListProviderDayAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let listProviderDayAvailability;
describe('ListProviderDayAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentRepository.default();
    listProviderDayAvailability = new _ListProviderDayAvailabilityService.default(fakeAppointmentsRepository);
  });
  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      user_id: 'user01',
      date: new Date(2020, 4, 21, 9, 0, 0)
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      user_id: 'user01',
      date: new Date(2020, 4, 20, 14, 0, 0)
    });
    await fakeAppointmentsRepository.create({
      provider_id: 'provider01',
      user_id: 'user01',
      date: new Date(2020, 4, 20, 16, 0, 0)
    });
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2020, 4, 20, 11).getTime());
    const availability = await listProviderDayAvailability.execute({
      day: 20,
      month: 5,
      year: 2020,
      provider_id: 'provider01'
    });
    expect(availability).toEqual(expect.arrayContaining([{
      hour: 8,
      available: false
    }, {
      hour: 12,
      available: true
    }, {
      hour: 14,
      available: false
    }, {
      hour: 15,
      available: true
    }, {
      hour: 16,
      available: false
    }, {
      hour: 17,
      available: true
    }]));
  });
});