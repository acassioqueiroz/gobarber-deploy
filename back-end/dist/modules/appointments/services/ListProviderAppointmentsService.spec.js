"use strict";

var _FakeAppointmentRepository = _interopRequireDefault(require("../repositories/fakes/FakeAppointmentRepository"));

var _FakeCacheProvider = _interopRequireDefault(require("../../../shared/container/providers/CacheProvider/fakes/FakeCacheProvider"));

var _ListProviderAppointmentsService = _interopRequireDefault(require("./ListProviderAppointmentsService"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let fakeAppointmentsRepository;
let listProviderAppointments;
let fakeCacheProvider;
describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new _FakeAppointmentRepository.default();
    fakeCacheProvider = new _FakeCacheProvider.default();
    listProviderAppointments = new _ListProviderAppointmentsService.default(fakeAppointmentsRepository, fakeCacheProvider);
  });
  it('should be able to list the appointments from provider in a specific day', async () => {
    const appointment01 = await fakeAppointmentsRepository.create({
      user_id: 'user01',
      provider_id: 'provider01',
      date: new Date(2020, 4, 21, 8, 0, 0)
    });
    const appointment02 = await fakeAppointmentsRepository.create({
      user_id: 'user01',
      provider_id: 'provider01',
      date: new Date(2020, 4, 21, 10, 0, 0)
    });
    await fakeAppointmentsRepository.create({
      user_id: 'user01',
      provider_id: 'provider01',
      date: new Date(2020, 4, 22, 8, 0, 0)
    });
    const availability = await listProviderAppointments.execute({
      day: 21,
      month: 5,
      year: 2020,
      provider_id: 'provider01'
    });
    expect(availability).toEqual([appointment01, appointment02]);
  });
});