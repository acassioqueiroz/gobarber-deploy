import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    day,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      {
        provider_id,
        day,
        month,
        year,
      },
    );

    const eachDayArray = Array.from({ length: 10 }, (_, index) => index + 8);

    const currentDate = new Date(Date.now());

    const availability = eachDayArray.map((hour) => {
      const appointmentsInHour = appointments.find((appointment) => {
        return getHours(appointment.date) === hour;
      });
      const appointmentDate = new Date(year, month - 1, day, hour);

      return {
        hour,
        available: !appointmentsInHour && isAfter(appointmentDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
