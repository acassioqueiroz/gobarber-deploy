"use strict";

var _FakeAppointmentRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentRepository"));

var _ListProviderMonthAvailabilityService = _interopRequireDefault(require("./ListProviderMonthAvailabilityService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let listProviderMonthAvailability;
describe('ListProviderMonthAvailabilityService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentRepository.default();
    listProviderMonthAvailability = new _ListProviderMonthAvailabilityService.default(fakeAppointmentsRepository);
  });
  it('should be able to list the month availability from provider', async () => {
    await fakeAppointmentsRepository.create({
      user_id: 'user01',
      provider_id: 'provider01',
      date: new Date(2020, 3, 21, 8, 0, 0)
    });
    await Promise.all([8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map(async hour => {
      await fakeAppointmentsRepository.create({
        user_id: 'user01',
        provider_id: 'provider01',
        date: new Date(2020, 4, 21, hour, 0, 0)
      });
    }));
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2020, 4, 20, 7).getTime());
    const availability = await listProviderMonthAvailability.execute({
      month: 5,
      year: 2020,
      provider_id: 'provider01'
    });
    expect(availability).toEqual(expect.arrayContaining([{
      day: 20,
      available: true
    }, {
      day: 21,
      available: false
    }, {
      day: 22,
      available: true
    }]));
  });
});