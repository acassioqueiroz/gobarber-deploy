import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentRepository;
let listProviderAppointments: ListProviderAppointmentsService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProviderAppointments = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the appointments from provider in a specific day', async () => {
    const appointment01 = await fakeAppointmentsRepository.create({
      user_id: 'user01',
      provider_id: 'provider01',
      date: new Date(2020, 4, 21, 8, 0, 0),
    });

    const appointment02 = await fakeAppointmentsRepository.create({
      user_id: 'user01',
      provider_id: 'provider01',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      user_id: 'user01',
      provider_id: 'provider01',
      date: new Date(2020, 4, 22, 8, 0, 0),
    });

    const availability = await listProviderAppointments.execute({
      day: 21,
      month: 5,
      year: 2020,
      provider_id: 'provider01',
    });

    expect(availability).toEqual([appointment01, appointment02]);
  });
});
